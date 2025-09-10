<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Pet;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class AppointmentController extends Controller
{
    use AuthorizesRequests;
    // Owner books a new appointment for one of their pets
    public function bookForPet(Request $request, Pet $pet)
    {
        $this->authorize('book', $pet);

        $data = $request->validate([
            'vet_id' => 'required|exists:users,id',
            'appointment_time' => 'required|date',
            'duration_minutes' => 'nullable|integer|min:10|max:240',
            'reason' => 'nullable|string|max:1000',
        ]);

        $vet = User::findOrFail($data['vet_id']);
        if (! $vet->isVet()) {
            return back()->withErrors(['vet_id' => 'Selected user is not a vet.']);
        }

        $start = Carbon::parse($data['appointment_time']);
        $end = (clone $start)->addMinutes($data['duration_minutes'] ?? 30);

        // conflict check: any appointment for vet overlapping
        $conflict = Appointment::where('vet_id', $vet->id)
            ->where(function ($q) use ($start, $end) {
                $q->whereBetween('appointment_time', [$start, $end])
                    ->orWhereRaw("appointment_time BETWEEN ? AND ?", [$start->toDateTimeString(), $end->toDateTimeString()]);
            })->exists();

        if ($conflict) {
            return back()->withErrors(['appointment_time' => 'Vet not available at that time.']);
        }

        $appointment = Appointment::create([
            'pet_id' => $pet->id,
            'owner_id' => $request->user()->id,
            'vet_id' => $vet->id,
            'appointment_time' => $start,
            'duration_minutes' => $data['duration_minutes'] ?? 30,
            'reason' => $data['reason'] ?? null,
            'status' => 'pending',
        ]);

        // TODO: fire notification to vet

        return redirect()->route('pets.show', $pet)->with('success', 'Appointment requested.');
    }

    // Vet view their appointments
    public function vetIndex(Request $request)
    {
        $this->authorize('viewAny', Appointment::class);
        $user = $request->user();

        if (! $user->isVet()) abort(403);

        $appointments = $user->appointmentsAsVet()->with('pet', 'owner')->where('appointment_time', '>=', now()->subDay())->orderBy('appointment_time')->paginate(20);

        return Inertia::render('Vets/Appointments/Index', [
            'appointments' => $appointments
        ]);
    }

    // Approve appointment
    public function approve(Request $request, Appointment $appointment)
    {
        $this->authorize('approve', $appointment);

        $appointment->update(['status' => 'approved']);

        // TODO: notify owner
        return redirect()->back()->with('success', 'Appointment approved.');
    }

    public function reschedule(Request $request, Appointment $appointment)
    {
        $this->authorize('reschedule', $appointment);

        $data = $request->validate([
            'appointment_time' => 'required|date',
            'duration_minutes' => 'nullable|integer|min:10|max:240',
        ]);

        $start = Carbon::parse($data['appointment_time']);
        $end = (clone $start)->addMinutes($data['duration_minutes'] ?? $appointment->duration_minutes);

        // conflict check
        $conflict = Appointment::where('vet_id', $appointment->vet_id)
            ->where('id', '!=', $appointment->id)
            ->whereBetween('appointment_time', [$start, $end])
            ->exists();

        if ($conflict) {
            return back()->withErrors(['appointment_time' => 'Vet not available at that time.']);
        }

        $appointment->update([
            'appointment_time' => $start,
            'duration_minutes' => $data['duration_minutes'] ?? $appointment->duration_minutes,
            'status' => 'rescheduled',
        ]);

        return redirect()->back()->with('success', 'Appointment rescheduled.');
    }

    public function cancel(Request $request, Appointment $appointment)
    {
        $this->authorize('cancel', $appointment);

        $appointment->update(['status' => 'cancelled']);

        return redirect()->back()->with('success', 'Appointment cancelled.');
    }

    public function show(Appointment $appointment)
    {
        $this->authorize('view', $appointment);

        $appointment->load('pet.owner', 'vet');

        return Inertia::render('Appointments/Show', ['appointment' => $appointment]);
    }
}
