<?php

namespace App\Policies;

use App\Models\AdoptionListing;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class AdoptionListingPolicy
{
    use HandlesAuthorization;

    public function view(User $user, AdoptionListing $listing)
    {
        return true; // public
    }

    public function create(User $user)
    {
        return $user->isShelter() || $user->role === 'admin';
    }

    public function update(User $user, AdoptionListing $listing)
    {
        return $user->id === $listing->shelter_id || $user->role === 'admin';
    }

    public function delete(User $user, AdoptionListing $listing)
    {
        return $user->id === $listing->shelter_id || $user->role === 'admin';
    }
}
