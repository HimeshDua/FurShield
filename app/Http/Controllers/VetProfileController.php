<?php

namespace App\Http\Controllers;

use App\Models\VetProfile;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class VetProfileController extends Controller
{
    use AuthorizesRequests;

    public function index(Request $request)
    {
        $q = $request->get('q');
        $vets = User::where('role', 'vet')
            ->when($q, fn($b) => $b->where('name', 'like', "%{$q}%"))
            ->with('vetProfile')
            ->paginate(12);

        return Inertia::render('Vets/Index', ['vets' => $vets]);
    }

    public function show(User $vet)
    {
        abort_unless($vet->isVet(), 404);
        $vet->load('vetProfile', 'reviews.user');
        return Inertia::render('Vets/Show', ['vet' => $vet]);
    }

    public function showOwn(Request $request)
    {
        $vet = $request->user();
        Gate::authorize('view', $vet);
        $vet->load('vetProfile');
        return Inertia::render('Vets/Profile', ['vet' => $vet]);
    }

    public function update(Request $request, VetProfile $vetProfile)
    {
        Gate::authorize('update', $vetProfile);

        $data = $request->validate([
            'specializations' => 'nullable|array',
            'qualifications' => 'nullable|string',
            'availability' => 'nullable|array',
            'consultation_fee' => 'nullable|numeric|min:0',
            'clinic_address' => 'nullable|string',
        ]);

        $vetProfile->update($data);

        return redirect()->back()->with('success', 'Profile updated.');
    }
}
