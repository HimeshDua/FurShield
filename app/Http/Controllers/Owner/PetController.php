<?php

namespace App\Http\Controllers\Owner;

use App\Models\Pet;
use App\Models\PetImage;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Gate;

class PetController extends Controller
{
    use AuthorizesRequests;
    public function index(Request $request)
    {
        $user = $request->user();
        $pets = $user->pets()->with('images')->latest()->paginate(12);

        return Inertia::render('Owner/Pets/Index', [
            'pet' => $pets ?? [],
        ]);
    }

    public function create()
    {
        return Inertia::render('Owner/Pets/Create');
    }


    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'species' => 'required|string|max:100',
            'breed' => 'nullable|string|max:255',
            'birth_date' => 'nullable|date',
            'gender' => 'nullable|in:male,female,unknown',
            'weight_kg' => 'nullable|numeric',
            'microchip' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'images.*' => 'nullable|image|max:4096'
        ]);

        $pet = Pet::create(array_merge($data, ['owner_id' => $request->user()->id]));

        // handle images quickly for hackathon
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $path = $file->store('pet_images', 'public');
                PetImage::create([
                    'pet_id' => $pet->id,
                    'path' => $path
                ]);
            }
        }

        return redirect()->route('owner.pets.health.create', $pet->slug)->with('success', 'Add Health Details To Procsed');
        // return redirect()->route('owner.pets.index')->with('success', 'Pet added.');
    }
public function show(Pet $pet)
{
    Gate::authorize('view', $pet);

    $pet->load(['images', 'appointments']); 
    $healthRecords = $pet->healthRecords()->paginate(10);

    return Inertia::render('Owner/Pets/Show', [
        'petwithAppointment' => $pet,
        'healthRecords' => $healthRecords
    ]);
}

    public function edit(Pet $pet)
    {
        Gate::authorize('update', $pet);
        return Inertia::render('Owner/Pets/Edit', ['pet' => $pet]);
    }

    public function update(Request $request, Pet $pet)
    {
        Gate::authorize('update', $pet);

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'species' => 'required|string|max:100',
            'breed' => 'nullable|string|max:255',
            'birth_date' => 'nullable|date',
            'gender' => 'nullable|in:male,female,unknown',
            'weight_kg' => 'nullable|numeric',
            'microchip' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        $pet->update($data);

        return redirect()->route('owner.pets.show', $pet)->with('success', 'Pet updated.');
    }

    public function updateReminders(Request $request, Pet $pet)
{
    // $this->authorize('update', $pet);

    $validated = $request->validate([
        'next_vaccination_at' => 'nullable|date',
        'next_food_at' => 'nullable|date',
    ]);

    $pet->update($validated);

    return back()->with('success', 'Reminders updated.');
}


    public function destroy(Pet $pet)
    {
        Gate::authorize('delete', $pet);
        $pet->delete();

        return redirect()->route('owner.pets.index')->with('success', 'Pet removed.');
    }
}
