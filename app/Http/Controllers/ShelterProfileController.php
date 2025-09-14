<?php

namespace App\Http\Controllers;

use App\Models\ShelterProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class ShelterProfileController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display the specified shelter profile.
     */
    public function show(ShelterProfile $shelterProfile)
    {
        // Authorize
        Gate::authorize('view', $shelterProfile);

        // Eager load related user and reviews
        $shelterProfile->loadMissing(['user', 'user.reviews']);

        // Return Inertia page (matches your Shelter/Shelter.tsx file)
        return Inertia::render('Shelter/Shelter', [
            'profile' => $shelterProfile,
        ]);
    }

    /**
     * Update the specified shelter profile.
     */
    public function update(Request $request, ShelterProfile $shelterProfile)
    {
        Gate::authorize('update', $shelterProfile);

        $validated = $request->validate([
            'location'      => ['nullable', 'string', 'max:255'],
            'mission'       => ['nullable', 'string'],
            'contact_email' => ['nullable', 'email', 'max:255'],
        ]);

        // Update only validated fields
        $shelterProfile->fill($validated)->save();

        return redirect()
            ->back()
            ->with('success', 'Shelter profile updated successfully.');
    }
}
