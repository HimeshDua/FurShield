<?php

namespace App\Policies;

use App\Models\ShelterProfile;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ShelterProfilePolicy
{
    use HandlesAuthorization;

    public function view(User $user, ShelterProfile $profile)
    {
        return true;
    }

    public function update(User $user, ShelterProfile $profile)
    {
        return $user->id === $profile->user_id || $user->role === 'admin';
    }
}
