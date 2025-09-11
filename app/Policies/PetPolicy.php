<?php

namespace App\Policies;

use App\Models\Pet;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class PetPolicy
{
    use HandlesAuthorization;

    public function view(User $user, Pet $pet)
    {
        return $user->id === $pet->owner_id || $user->isVet() || $user->isShelter() || $user->role === 'admin';
    }

    public function create(User $user)
    {
        return $user->isOwner() || $user->role === 'admin';
    }

    public function update(User $user, Pet $pet)
    {
        return $user->id === $pet->owner_id || $user->role === 'admin';
    }

    public function delete(User $user, Pet $pet)
    {
        return $user->id === $pet->owner_id || $user->role === 'admin';
    }

    // owner books for own pet
    public function book(User $user, Pet $pet)
    {
        return $user->id === $pet->owner_id;
    }
}
