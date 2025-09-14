<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Models\Pet;
use App\Models\VetProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AppointmentBrowseController extends Controller
{
    public function index()
    {
        $vets = VetProfile::with('user')
            ->whereHas('user', function ($q) {
                $q->where('role', operator: 'vet');
            })
            ->get();

        return Inertia::render('Public/Vets/BrowseVets', [
            'vets' => $vets,
        ]);
    }

    public function show(VetProfile $vet, Request $request)
    {
        
        $pets = Pet::where('owner_id' , Auth::user()->id)->get();
        $vet->load('user');

        return Inertia::render('Public/Vets/Show', [
            'vet' => $vet ?? [],
            'pets' => $pets ?? [],
        ]);
    }
}
