<?php

namespace App\Http\Controllers;

use App\Models\Pet;
use App\Models\PetImage;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;

class PetController extends Controller
{
    public function __construct()
    {
        // ensure user is authenticated for these resource routes (middleware applied in routes/web.php)
        Gate::middleware('auth');
    }

    /**
     * Display a listing of the owner's pets.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $pets = Pet::where('owner_id', $user->id)
            ->with('images')
            ->orderBy('created_at', 'desc')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Owner/Pets/Index', [
            'pets' => $pets,
        ]);
    }

    /**
     * Show the form for creating a new pet.
     */
    public function create()
    {
        return Inertia::render('Owner/Pets/Create');
    }

    /**
     * Store a newly created pet in storage.
     */
    public function store(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'required|string|max:191',
            'species' => 'required|string|max:100',
            'breed' => 'nullable|string|max:100',
            'birth_date' => 'nullable|date',
            'gender' => 'nullable|in:male,female,unknown',
            'notes' => 'nullable|string|max:2000',
            'images.*' => 'nullable|file|image|max:8192', // max 8MB per file
        ]);

        DB::beginTransaction();
        try {
            $pet = Pet::create([
                'owner_id' => $user->id,
                'name' => $validated['name'],
                'species' => $validated['species'],
                'breed' => $validated['breed'] ?? null,
                'birth_date' => $validated['birth_date'] ?? null,
                'gender' => $validated['gender'] ?? 'unknown',
                'notes' => $validated['notes'] ?? null,
            ]);

            // Handle image uploads (optional)
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $index => $file) {
                    $path = $file->store('pet-images', 'public');

                    $pet->images()->create([
                        'path' => $path,
                        'alt' => $pet->name . ' image ' . ($index + 1),
                        'is_primary' => $index === 0,
                    ]);
                }
            }

            DB::commit();

            return redirect()->route('owner.pets.show', $pet->id)
                ->with('success', 'Pet created successfully.');
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('Pet store failed: ' . $e->getMessage());
            return back()->withInput()->with('error', 'Failed to create pet. Please try again.');
        }
    }

    /**
     * Display the specified pet.
     */
    public function show(Request $request, Pet $pet)
    {
        // authorization: ensure owner owns this pet
        Gate::authorize('view', $pet);

        $pet->load(['images', 'healthRecords.vet', 'owner']);

        return Inertia::render('Owner/Pets/Show', [
            'pet' => $pet,
        ]);
    }

    /**
     * Show the form for editing the specified pet.
     */
    public function edit(Request $request, Pet $pet)
    {
        Gate::authorize('update', $pet);

        $pet->load('images');

        return Inertia::render('Owner/Pets/Edit', [
            'pet' => $pet,
        ]);
    }

    /**
     * Update the specified pet in storage.
     */
    public function update(Request $request, Pet $pet)
    {
        Gate::authorize('update', $pet);

        $validated = $request->validate([
            'name' => 'required|string|max:191',
            'species' => 'required|string|max:100',
            'breed' => 'nullable|string|max:100',
            'birth_date' => 'nullable|date',
            'gender' => 'nullable|in:male,female,unknown',
            'notes' => 'nullable|string|max:2000',
            'images.*' => 'nullable|file|image|max:8192',
            'remove_image_ids' => 'nullable|array',
            'remove_image_ids.*' => 'integer|exists:pet_images,id',
        ]);

        DB::beginTransaction();
        try {
            $pet->update([
                'name' => $validated['name'],
                'species' => $validated['species'],
                'breed' => $validated['breed'] ?? null,
                'birth_date' => $validated['birth_date'] ?? null,
                'gender' => $validated['gender'] ?? $pet->gender,
                'notes' => $validated['notes'] ?? $pet->notes,
            ]);

            // Remove images if requested
            if (!empty($validated['remove_image_ids'])) {
                $ids = $validated['remove_image_ids'];
                $images = $pet->images()->whereIn('id', $ids)->get();
                foreach ($images as $img) {
                    Storage::disk('public')->delete($img->path);
                    $img->delete();
                }
            }

            // Add new uploads
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $file) {
                    $path = $file->store('pet-images', 'public');
                    $pet->images()->create(['path' => $path, 'alt' => $pet->name]);
                }
            }

            DB::commit();

            return redirect()->route('owner.pets.show', $pet->id)
                ->with('success', 'Pet updated successfully.');
        } catch (\Throwable $e) {
            DB::rollBack();
            \Log::error('Pet update failed: ' . $e->getMessage());
            return back()->withInput()->with('error', 'Failed to update pet.');
        }
    }

    /**
     * Remove the specified pet from storage (soft delete recommended).
     */
    public function destroy(Request $request, Pet $pet)
    {
        Gate::authorize('delete', $pet);

        // Soft delete if model uses SoftDeletes, otherwise delete images and rows
        try {
            // delete related images files
            foreach ($pet->images as $img) {
                Storage::disk('public')->delete($img->path);
                $img->delete();
            }

            $pet->delete();

            return redirect()->route('owner.pets.index')
                ->with('success', 'Pet removed successfully.');
        } catch (\Throwable $e) {
            \Log::error('Pet destroy failed: ' . $e->getMessage());
            return back()->with('error', 'Failed to remove pet.');
        }
    }
}
