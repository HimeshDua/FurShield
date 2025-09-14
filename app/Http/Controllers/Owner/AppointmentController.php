<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Pet;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class AppointmentController extends Controller
{
    use AuthorizesRequests;

    public function index(Request $request)
    {
        $appointments = Appointment::with(['pet.images', 'vet'])
            ->where('owner_id', operator: $request->user()->id)
            ->orderBy('appointment_time', 'desc')
            ->paginate(12);

        return Inertia::render('Owner/Appointments/Index', [
            'appointments' => $appointments,
        ]);
    }

    public function create(Pet $pet)
    {
        $pet->load('images');
        $vets = User::where('role', 'vet')->select('id', 'name', 'email')->get();

        return Inertia::render('Owner/Appointments/Create', [
            'pet' => $pet,
            'vets' => $vets,
        ]);
    }

    public function cancel(Appointment $appointment)
    {
        // $this->authorize('update', $appointment);
        $appointment->status = 'cancelled';
        $appointment->save();

        return redirect()->back()->with('success', 'Appointment cancelled.');
    }

    public function store(Request $request, Pet $pet)
    {

        $validated = $request->validate([
            'vet_id' => 'required|integer|exists:users,id',
            'appointment_time' => 'required|date_format:Y-m-d\TH:i',
            'duration_minutes' => 'nullable|integer|min:10|max:480',
            'reason' => 'nullable|string|max:2000',
        ]);

        $vet = User::find($validated['vet_id']);
        if (!$vet || $vet->role !== 'vet') {
            throw ValidationException::withMessages(['vet_id' => 'Selected user is not a vet.']);
        }

        $start = Carbon::parse($validated['appointment_time']);
        $duration = $validated['duration_minutes'] ?? 30;
        $end = (clone $start)->addMinutes($duration);

        $conflict = Appointment::where('vet_id', $vet->id)
            ->where(function ($q) use ($start, $end) {
                $q->whereBetween('appointment_time', [$start, $end->subSecond()])
                    ->orWhereRaw("(appointment_time + INTERVAL duration_minutes MINUTE) > ?", [$start->toDateTimeString()]);
            })
            ->whereIn('status', ['approved', 'pending'])
            ->exists();

        if ($conflict) {
            throw ValidationException::withMessages(['appointment_time' => 'Selected time conflicts with vet availability.']);
        }

        DB::beginTransaction();
        try {
            Appointment::create([
                'pet_id' => $pet->id,
                'owner_id' => $request->user()->id,
                'vet_id' => $vet->id,
                'appointment_time' => $start,
                'duration_minutes' => $duration,
                'reason' => $validated['reason'] ?? null,
                'status' => 'pending',
            ]);

            DB::commit();

            return redirect()->route('vets.index')->with('success', 'Appointment requested — awaiting vet confirmation.');
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('Appointment booking failed: ' . $e->getMessage());
            return back()->withInput()->with('error', 'Failed to request appointment.');
        }


    }


    public function show(Appointment $appointment)
    {
        if ($appointment->owner_id !== Auth::user()->id) {
            abort(403, 'Unauthorized access to this appointment.');
        }

        
        $appointment->load([
            'pet.images',
                        'pet.healthRecords' => function ($q) {
                $q->latest()->take(10);
            },
            'vet',           
            'vet.vetProfile',
        ]);

        return Inertia::render('Owner/Appointments/Show', [
            'appointment' => $appointment,
            'pet' => $appointment->pet,
            'recentHealthRecords' => $appointment->pet->healthRecords ?? [],
            'vet' => $appointment->vet,
        ]);
    }

}
