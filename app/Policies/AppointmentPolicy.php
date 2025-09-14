<?php

namespace App\Policies;

use App\Models\Appointment;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class AppointmentPolicy
{
    use HandlesAuthorization;

    public function view(User $user, Appointment $appointment)
    {
        return $user->id === $appointment->owner_id || $user->id === $appointment->vet_id || $user->role === 'admin';
    }

    public function viewAny(User $user)
    {
        // vets can view their appointments; admins can; owners view via pet
        return $user->isVet() || $user->role === 'admin';
    }

    public function approve(User $user, Appointment $appointment)
    {
        return $user->isVet() && $appointment->vet_id === $user->id;
    }

    public function reschedule(User $user, Appointment $appointment)
    {
        // vet or owner who booked can request reschedule
        return $user->id === $appointment->vet_id || $user->id === $appointment->owner_id || $user->role === 'admin';
    }

    public function cancel(User $user, Appointment $appointment)
    {
        return $user->id === $appointment->owner_id || $user->id === $appointment->vet_id || $user->role === 'admin';
    }

    public function create(User $user)
    {
        return $user->isOwner() || $user->role === 'admin';
    }
}
