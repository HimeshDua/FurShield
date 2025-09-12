<?php

namespace App\Http\Controllers;

use App\Models\ShelterProfile;
use Illuminate\Http\Request;
use Inertia\Inertia;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Gate;

class ShelterController extends Controller
{
    use AuthorizesRequests;
    public function show(Request $request, ShelterProfile $shelterProfile)
    {
        Gate::authorize('view', $shelterProfile);
        $shelterProfile->load('user', 'user.reviews');
        return Inertia::render('Shelters/Show', ['profile' => $shelterProfile]);
    }

    public function update(Request $request, ShelterProfile $shelterProfile)
    {
        Gate::authorize('update', $shelterProfile);

        $data = $request->validate([
            'location' => 'nullable|string|max:255',
            'mission' => 'nullable|string',
            'contact_email' => 'nullable|email',
        ]);

        $shelterProfile->update($data);

        return redirect()->back()->with('success', 'Shelter updated.');
    }
}
