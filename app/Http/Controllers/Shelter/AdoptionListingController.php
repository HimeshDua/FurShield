<?php

namespace App\Http\Controllers\Shelter;

use App\Http\Controllers\Controller;
use App\Models\AdoptionListing;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class AdoptionListingController extends Controller
{
    use AuthorizesRequests;
    public function index()
    {
        $listings = AdoptionListing::where('status', 'available')->paginate(12);
        return Inertia::render('Public/Adoptions/Index', ['adoptions' => $listings]);
    }

    public function create()
    {
        return Inertia::render('Shelter/Adoptions/Create');
    }

    public function store(Request $request)
    {
        Gate::authorize('create', AdoptionListing::class);

        $data = $request->validate([
            'pet_name' => 'required|string|max:255',
            'species' => 'required|string|max:80',
            'breed' => 'nullable|string|max:255',
            'age' => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'images' => 'nullable|array',
        ]);

        $listing = AdoptionListing::create(array_merge($data, ['shelter_id' => $request->user()->id]));

        return redirect()->route('adoptions.index')->with('success', 'Listing created.');
    }

    public function show(AdoptionListing $adoption)
    {
        return Inertia::render('Shelter/Adoptions/Show', ['listing' => $adoption]);
    }

    public function edit(AdoptionListing $adoption)
    {
        Gate::authorize('update', $adoption);
        return Inertia::render('Shelter/Adoptions/Edit', ['listing' => $adoption]);
    }

    public function update(Request $request, AdoptionListing $adoption)
    {
        Gate::authorize('update', $adoption);

        $data = $request->validate([
            'pet_name' => 'required|string|max:255',
            'species' => 'required|string|max:80',
            'breed' => 'nullable|string|max:255',
            'age' => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'status' => 'nullable|in:available,pending,adopted'
        ]);

        $adoption->update($data);

        return redirect()->route('adoptions.show', $adoption)->with('success', 'Listing updated.');
    }

    public function destroy(AdoptionListing $adoption)
    {
        Gate::authorize('delete', $adoption);
        $adoption->delete();
        return redirect()->route('adoptions.index')->with('success', 'Listing removed.');
    }
}
