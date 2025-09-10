<?php

namespace App\Http\Controllers;

use App\Models\Pet;
use App\Models\PetImage;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class PetController extends Controller
{
    use AuthorizesRequests;
    public function index(Request $request)
    {
        $user = $request->user();
        $pets = $user->pets()->with('images')->paginate(12);

        return Inertia::render('Pets/Index', [
            'pets' => $pets,
        ]);
    }

    public function create()
    {
        return Inertia::render('Pets/Create');
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

        return redirect()->route('pets.index')->with('success', 'Pet added.');
    }

    public function show(Pet $pet)
    {
        $this->authorize('view', $pet);

        $pet->load(['images', 'healthRecords', 'appointments']);

        return Inertia::render('Pets/Show', [
            'pet' => $pet
        ]);
    }

    public function edit(Pet $pet)
    {
        $this->authorize('update', $pet);
        return Inertia::render('Pets/Edit', ['pet' => $pet]);
    }

    public function update(Request $request, Pet $pet)
    {
        $this->authorize('update', $pet);

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

        return redirect()->route('pets.show', $pet)->with('success', 'Pet updated.');
    }

    public function destroy(Pet $pet)
    {
        $this->authorize('delete', $pet);
        $pet->delete();

        return redirect()->route('pets.index')->with('success', 'Pet removed.');
    }
}
