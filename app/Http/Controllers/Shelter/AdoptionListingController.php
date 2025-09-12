<?php

namespace App\Http\Controllers\Shelter;

use App\Http\Controllers\Controller;
use App\Models\AdoptionListing;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AdoptionListingController extends Controller
{
    use AuthorizesRequests;

    public function index(Request $request)
    {
        $listings = AdoptionListing::where('shelter_id', Auth::id())
            ->latest()
            ->paginate(12);

        return Inertia::render('Shelter/Adoptions/Index', [
            'adoptions' => $listings ?? [],
        ]);
    }

    public function create()
    {
        return Inertia::render('Shelter/Adoptions/Create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'pet_name'    => 'required|string|max:255',
            'species'     => 'required|string|max:100',
            'breed'       => 'nullable|string|max:100',
            'age'         => 'nullable|string|max:50',
            'description' => 'nullable|string',
            'status'      => 'nullable|in:available,pending,adopted',
            'images.*'    => 'nullable|image|max:4096',
        ]);

        $data['shelter_id'] = Auth::id();

        // Handle image uploads
        $images = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $images[] = $file->store('adoptions', 'public');
            }
        }
        $data['images'] = $images;

        AdoptionListing::create($data);

        return redirect()->route('shelter.adoptions.index')
            ->with('success', 'Adoption listing created successfully.');
    }

    public function edit(AdoptionListing $adoption)
    {
        $this->authorize('update', $adoption);
        return Inertia::render('Shelter/Adoptions/Edit', [
            'adoption' => $adoption,
        ]);
    }

    public function update(Request $request, AdoptionListing $adoption)
    {
        // $this->authorize('update', $adoption);
        // 
        $data = $request->validate([
            'pet_name'    => 'required|string|max:255',
            'species'     => 'required|string|max:100',
            'breed'       => 'nullable|string|max:100',
            'age'         => 'nullable|string|max:50',
            'description' => 'nullable|string',
            'status'      => 'nullable|in:available,pending,adopted',
            'images.*'    => 'nullable|image|max:4096',
        ]);

        $images = $adoption->images ?? [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $images[] = $file->store('adoptions', 'public');
            }
        }
        $data['images'] = $images;

        $adoption->update($data);

        return redirect()->route('shelter.adoptions.index')
            ->with('success', 'Adoption listing updated successfully.');
    }

    public function destroy(AdoptionListing $adoption)
    {
        $this->authorize('delete', $adoption);

        // Clean up stored images
        if ($adoption->images) {
            foreach ($adoption->images as $path) {
                Storage::disk('public')->delete($path);
            }
        }

        $adoption->delete();

        return back()->with('success', 'Adoption listing deleted.');
    }
}
