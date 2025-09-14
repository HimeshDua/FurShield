<?php

namespace App\Http\Controllers\Vet;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\HealthRecord;
use App\Models\Pet;
use App\Models\User;
use App\Models\VetProfile;
use Carbon\Carbon;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class VeterinarianController extends Controller
{
    use AuthorizesRequests;

    public function dashboard(Request $request)
    {
        $vet = $request->user();
        $vetProfile = VetProfile::firstOrCreate(['user_id' => $vet->id]);

        if(!$vetProfile->specializations || !$vetProfile->availability){
            return redirect()->route('vet.profile.create');
        }

        $upcomingAppointments = Appointment::where('vet_id', $vet->id)
            ->whereIn('status', ['pending','approved','rescheduled'])
            ->where('appointment_time', '>=', Carbon::now())
            ->with(['pet', 'owner'])
            ->orderBy('appointment_time')
            ->limit(12)
            ->get();

        return Inertia::render('Vet/Dashboard', [
            'vetProfile' => $vetProfile,
            'upcomingAppointments' => $upcomingAppointments,
            'availability' => $vetProfile->availability ?? [],
        ]);
    }

 
    public function appointments(Request $request)
    {
        $vetId = $request->user()->id;

        $q = Appointment::query()->where('vet_id', $vetId)
            ->with(['pet.images', 'owner'])
            ->orderBy('appointment_time', 'desc');

        if ($request->filled('status')) {
            $q->where('status', $request->input('status'));
        }

        if ($request->filled('date_from')) {
            $q->where('appointment_time', '>=', Carbon::parse($request->input('date_from'))->startOfDay());
        }

        if ($request->filled('date_to')) {
            $q->where('appointment_time', '<=', Carbon::parse($request->input('date_to'))->endOfDay());
        }

        $appointments = $q->paginate(12)->withQueryString();

        return Inertia::render('Vet/Appointments/Index', [
            'appointments' => $appointments,
        ]);
    }

    public function showAppointment(Request $request, Appointment $appointment)
    {
        $appointment->load(['pet.images', 'owner', 'pet.healthRecords' => function ($q) {
            $q->latest()->limit(10);
        }]);

        return Inertia::render('Vet/Appointments/Show', [
            'appointment' => $appointment,
            'pet' => $appointment->pet,
            'recentHealthRecords' => $appointment->pet->healthRecords->take(10) ?? [],
        ]);
    }

    public function approveAppointment(Request $request, Appointment $appointment)
    {
        if ($appointment->status === 'cancelled' || $appointment->status === 'completed') {
            return back()->with('error', 'Cannot approve an appointment that is cancelled or completed.');
        }

        $appointment->update([
            'status' => 'approved',
        ]);

        if ($request->wantsJson()) {
            return response()->json(['message' => 'Appointment approved.', 'appointment' => $appointment]);
        }

        return redirect()->route('vets.index')->with('success', 'Appointment approved.');
    }

    public function rescheduleAppointment(Request $request, Appointment $appointment)
    {
        $this->guardVetOwnership($appointment);

        $data = $request->validate([
            'appointment_time' => 'required|date',
            'reason' => 'nullable|string|max:1000'
        ]);

        $newTime = Carbon::parse($data['appointment_time']);

        $appointment->update([
            'appointment_time' => $newTime,
            'status' => 'rescheduled',
            'reason' => $data['reason'] ?? $appointment->reason
        ]);

        // Optional: notify owner
        // $appointment->owner->notify(new \App\Notifications\AppointmentRescheduled($appointment));

        if ($request->wantsJson()) {
            return response()->json(['message' => 'Appointment rescheduled.', 'appointment' => $appointment]);
        }

        return redirect()->route('vets.index')->with('success', 'Appointment rescheduled.');
    }

    /**
     * Cancel an appointment.
     */
    public function cancelAppointment(Request $request, Appointment $appointment)
    {

        $data = $request->validate([
            'reason' => 'nullable|string|max:1000'
        ]);

        $appointment->update([
            'status' => 'cancelled',
            'reason' => $data['reason'] ?? $appointment->reason,
        ]);

        // Optional: notify owner
        // $appointment->owner->notify(new \App\Notifications\AppointmentCancelled($appointment));

        if ($request->wantsJson()) {
            return response()->json(['message' => 'Appointment cancelled.', 'appointment' => $appointment]);
        }

        return redirect()->route('vets.index')->with('success', 'Appointment cancelled.');
    }

    public function completeAppointment(Request $request, Appointment $appointment)
    {
        $this->guardVetOwnership($appointment);

        $data = $request->validate([
            'title' => 'nullable|string|max:255',
            'diagnosis' => 'nullable|string',
            'treatment' => 'nullable|string',
            'visit_date' => 'nullable|date',
            'attachments.*' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:5120'
        ]);

        $hr = HealthRecord::create([
            'pet_id' => $appointment->pet_id,
            'vet_id' => $appointment->vet_id,
            'visit_date' => $data['visit_date'] ? Carbon::parse($data['visit_date'])->toDateString() : Carbon::now()->toDateString(),
            'title' => $data['title'] ?? 'Consultation: ' . $appointment->id,
            'diagnosis' => $data['diagnosis'] ?? null,
            'treatment' => $data['treatment'] ?? null,
        ]);

        if ($request->hasFile('attachments')) {
            $paths = [];
            foreach ($request->file('attachments') as $file) {
                $paths[] = $file->store('health-records', 'public');
            }
            $hr->attachments = json_encode($paths);
            $hr->save();
        }

        $appointment->update(['status' => 'completed']);

        if ($request->wantsJson()) {
            return response()->json(['message' => 'Appointment completed and health record created.', 'health_record' => $hr]);
        }

        return redirect()->route('vets.index')->with('success', 'Appointment completed and health record added.');
    }

    public function availabilityIndex(Request $request)
    {
        $vet = $request->user();
        $profile = VetProfile::firstOrCreate(['user_id' => $vet->id]);

        return Inertia::render('Vet/Schedule/Index', [
    'availability' => $profile->availability ?? [],
]);

    }

    public function saveAvailability(Request $request)
    {
        $vet = $request->user();
        $profile = VetProfile::firstOrCreate(['user_id' => $vet->id]);

        $validator = Validator::make($request->all(), [
            'slots' => 'required|array',
            'slots.*.day' => ['required', Rule::in(['monday','tuesday','wednesday','thursday','friday','saturday','sunday'])],
            'slots.*.start_time' => 'required|date_format:H:i',
            'slots.*.end_time' => 'required|date_format:H:i|after:slots.*.start_time',
            'slots.*.notes' => 'nullable|string|max:255'
        ], [
            'slots.*.end_time.after' => 'End time must be after start time.'
        ]);

        if ($validator->fails()) {
            if ($request->wantsJson()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }
            return back()->withErrors($validator)->withInput();
        }

        $slots = collect($request->input('slots'))->map(function ($slot) {
            return array_merge(['id' => $slot['id'] ?? (string) Str::uuid()], $slot);
        })->values()->toArray();

        $profile->availability = $slots;
        $profile->save();

        if ($request->wantsJson()) {
            return response()->json(['message' => 'Availability saved.', 'availability' => $slots]);
        }

        return redirect()->route('vet.dashboard')->with('success', 'Availability updated.');
    }
    public function addAvailabilitySlot(Request $request)
    {
        $vet = $request->user();
        $profile = VetProfile::firstOrCreate(['user_id' => $vet->id]);

        $data = $request->validate([
            'day' => ['required', Rule::in(['monday','tuesday','wednesday','thursday','friday','saturday','sunday'])],
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'notes' => 'nullable|string|max:255',
        ]);

        $slot = array_merge($data, ['id' => (string) Str::uuid()]);

        $availability = collect($profile->availability ?? [])->push($slot)->values()->toArray();
        $profile->availability = $availability;
        $profile->save();

        if ($request->wantsJson()) {
            return response()->json(['message' => 'Slot added.', 'slot' => $slot]);
        }

        return back()->with('success', 'Availability slot added.');
    }

    public function removeAvailabilitySlot(Request $request, $slotId)
    {
        $vet = $request->user();
        $profile = VetProfile::firstOrCreate(['user_id' => $vet->id]);

        $availability = collect($profile->availability ?? [])->reject(function ($s) use ($slotId) {
            return isset($s['id']) && $s['id'] === (string) $slotId;
        })->values()->toArray();

        $profile->availability = $availability;
        $profile->save();

        if ($request->wantsJson()) {
            return response()->json(['message' => 'Slot removed.', 'availability' => $availability]);
        }

        return back()->with('success', 'Availability slot removed.');
    }

    protected function guardVetOwnership(Appointment $appointment)
    {
        $user = Auth::user();
        if ($appointment->vet_id !== $user->id) {
            abort(403, 'Unauthorized action for this appointment.');
        }
    }
}
