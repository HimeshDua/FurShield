<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Pet;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class AppointmentController extends Controller
{
    public function __construct()
    {
        Gate::middleware('auth');
    }

    /**
     * Owner books an appointment for a specific pet.
     *
     * POST /appointments/{pet}
     */
    public function bookForPet(Request $request, Pet $pet)
    {
        // ensure the current user owns the pet
        Gate::authorize('book', $pet); // PetPolicy::book should check owner

        $validated = $request->validate([
            'vet_id' => 'required|integer|exists:users,id',
            'appointment_time' => 'required|date_format:Y-m-d\TH:i', // html datetime-local format
            'duration_minutes' => 'nullable|integer|min:10|max:480',
            'reason' => 'nullable|string|max:2000',
        ]);

        // Ensure vet exists and has role 'vet'
        $vet = User::find($validated['vet_id']);
        if (!$vet || $vet->role !== 'vet') {
            throw ValidationException::withMessages(['vet_id' => 'Selected user is not a vet.']);
        }

        $start = \Carbon\Carbon::parse($validated['appointment_time']);
        $duration = $validated['duration_minutes'] ?? 30;
        $end = (clone $start)->addMinutes($duration);

        // Check vet overlapping appointments
        $conflict = Appointment::where('vet_id', $vet->id)
            ->where(function ($q) use ($start, $end) {
                $q->whereBetween('appointment_time', [$start, $end->subSecond()])
                    ->orWhereRaw("(appointment_time + INTERVAL duration_minutes MINUTE) > ?", [$start->toDateTimeString()]);
            })
            ->whereIn('status', ['approved', 'pending'])
            ->exists();

        if ($conflict) {
            // You may suggest alternative times here (omitted for brevity)
            throw ValidationException::withMessages(['appointment_time' => 'Selected time conflicts with vet availability. Please choose another slot.']);
        }

        DB::beginTransaction();
        try {
            $appointment = Appointment::create([
                'pet_id' => $pet->id,
                'owner_id' => $request->user()->id,
                'vet_id' => $vet->id,
                'appointment_time' => $start,
                'duration_minutes' => $duration,
                'reason' => $validated['reason'] ?? null,
                'status' => 'pending',
            ]);

            DB::commit();

            // TODO: notify vet (Notification / Mail) about new appointment request.

            return redirect()->route('owner.dashboard')->with('success', 'Appointment requested — awaiting vet confirmation.');
        } catch (\Throwable $e) {
            DB::rollBack();
            \Log::error('Appointment booking failed: ' . $e->getMessage());
            return back()->withInput()->with('error', 'Failed to request appointment.');
        }
    }

    /**
     * Vet: list appointments assigned to the vet (used for vet dashboard)
     * Mapped to GET /vet/appointments
     */
    public function vetIndex(Request $request)
    {
        $user = $request->user();
        Gate::authorize('viewVetDashboard', $user); // implement in policy if desired

        $appointments = Appointment::with('pet', 'owner')
            ->where('vet_id', $user->id)
            ->orderBy('appointment_time', 'asc')
            ->paginate(20);

        return Inertia::render('Vet/Appointments/Index', [
            'appointments' => $appointments,
        ]);
    }

    /**
     * Vet approves an appointment
     */
    public function approve(Request $request, Appointment $appointment)
    {
        Gate::authorize('approve', $appointment); // AppointmentPolicy@approve

        $appointment->status = 'approved';
        $appointment->save();

        // TODO: notify owner about approval

        return back()->with('success', 'Appointment approved.');
    }

    /**
     * Vet reschedules an appointment
     */
    public function reschedule(Request $request, Appointment $appointment)
    {
        Gate::authorize('reschedule', $appointment);

        $validated = $request->validate([
            'appointment_time' => 'required|date_format:Y-m-d\TH:i',
            'duration_minutes' => 'nullable|integer|min:10|max:480',
        ]);

        $start = \Carbon\Carbon::parse($validated['appointment_time']);
        $duration = $validated['duration_minutes'] ?? $appointment->duration_minutes;
        $end = (clone $start)->addMinutes($duration);

        // Check conflicts similar to bookForPet (omitted for brevity)
        $conflict = Appointment::where('vet_id', $appointment->vet_id)
            ->where('id', '<>', $appointment->id)
            ->where(function ($q) use ($start, $end) {
                $q->whereBetween('appointment_time', [$start, $end->subSecond()])
                    ->orWhereRaw("(appointment_time + INTERVAL duration_minutes MINUTE) > ?", [$start->toDateTimeString()]);
            })
            ->whereIn('status', ['approved', 'pending'])
            ->exists();

        if ($conflict) {
            return back()->with('error', 'Selected time conflicts with existing appointments.');
        }

        $appointment->appointment_time = $start;
        $appointment->duration_minutes = $duration;
        $appointment->status = 'pending'; // or keep approved depending on business rules
        $appointment->save();

        return back()->with('success', 'Appointment rescheduled.');
    }

    /**
     * Cancel appointment (owner or vet)
     */
    public function cancel(Request $request, Appointment $appointment)
    {
        // policy should allow owner or vet to cancel
        Gate::authorize('cancel', $appointment);

        $appointment->status = 'cancelled';
        $appointment->save();

        // TODO: notify other party

        return back()->with('success', 'Appointment cancelled.');
    }
}
