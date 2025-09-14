<?php

namespace App\Http\Controllers\Vet;

use App\Http\Controllers\Controller;
use App\Models\VetProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class VetProfileController extends Controller
{
    public function index()
    {
        $vets = VetProfile::with('user')
            ->whereHas('user', fn($q) => $q->where('role', 'vet'))
            ->get();

        return Inertia::render('Public/BrowseVets', [
            'vets' => $vets,
        ]);
    }
    
    public function store(Request $request)
    {
        $request->validate([
            'specializations' => ['required', 'array'],
            'qualifications' => ['required', 'string'],
            'availability' => ['required', 'array'],
            'consultation_fee' => ['required', 'numeric'],
            'clinic_address' => ['required', 'string'],
        ]);

        VetProfile::updateOrCreate(
            ['user_id' => Auth::user()->id],
            [
                'specializations' => $request->specializations,
                'qualifications' => $request->qualifications,
                'availability' => $request->availability,
                'consultation_fee' => $request->consultation_fee,
                'clinic_address' => $request->clinic_address,
            ]
        );

        return redirect()->route('vet.dashboard')->with('success', 'Profile saved successfully!');
    }

     public function create()
    {
        return Inertia::render('Vet/CreateProfile', );
    }
    
    public function edit()
    {
        $profile = VetProfile::where('user_id', auth()->id())->firstOrFail();

        return Inertia::render('Vet/EditProfile', [
            'profile' => $profile,
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'specializations' => ['required', 'array'],
            'qualifications' => ['required', 'string'],
            'availability' => ['required', 'array'],
            'consultation_fee' => ['required', 'numeric'],
            'clinic_address' => ['required', 'string'],
        ]);

        VetProfile::where('user_id', auth()->id())->update([
            'specializations' => $request->specializations,
            'qualifications' => $request->qualifications,
            'availability' => $request->availability,
            'consultation_fee' => $request->consultation_fee,
            'clinic_address' => $request->clinic_address,
        ]);

        return back()->with('success', 'Profile updated successfully!');
    }
}