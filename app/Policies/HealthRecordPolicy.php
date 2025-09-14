<?php

namespace App\Policies;

use App\Models\HealthRecord;
use App\Models\Pet;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class HealthRecordPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user, Pet $pet)
    {
        // owners see health records of their pets; vets see records for pets they handled (simple)
        return $user->id === $pet->owner_id || $user->isVet() || $user->role === 'admin';
    }

    public function view(User $user, HealthRecord $record)
    {
        return $user->id === $record->pet->owner_id || ($user->isVet() && $record->vet_id === $user->id) || $user->role === 'admin';
    }

    public function create(User $user, Pet $pet = null)
    {
        // vets create records for pets (or owner can upload)
        return $user->isVet() || $user->id === optional($pet)->owner_id || $user->role === 'admin';
    }

    public function update(User $user, HealthRecord $record)
    {
        // only vet who created it or admin
        return ($user->isVet() && $record->vet_id === $user->id) || $user->id === $record->pet->owner_id || $user->role === 'admin';
    }

    public function delete(User $user, HealthRecord $record)
    {
        return $user->role === 'admin' || $user->id === $record->pet->owner_id;
    }
}
