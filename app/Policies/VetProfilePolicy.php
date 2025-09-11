<?php

namespace App\Policies;

use App\Models\VetProfile;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class VetProfilePolicy
{
    use HandlesAuthorization;

    public function view(User $user, VetProfile $profile)
    {
        return true; // profiles are public for browsing
    }

    public function update(User $user, VetProfile $profile)
    {
        return $user->id === $profile->user_id || $user->role === 'admin';
    }
}
