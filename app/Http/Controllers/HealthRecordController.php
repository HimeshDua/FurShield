<?php

namespace App\Http\Controllers;

use App\Models\HealthRecord;
use App\Models\Pet;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;

class HealthRecordController extends Controller
{
    
    public function indexForPet(Request $request, Pet $pet)
    {
        
        Gate::authorize('view', $pet);

        $records = HealthRecord::where('pet_id', $pet->id)
            ->with('vet')
            ->orderBy('visit_date', 'desc')
            ->paginate(20);

        return Inertia::render('Owner/Pets/Health/Index', [
            'pet' => $pet,
            'records' => $records,
        ]);
    }

    public function create(Request $request, Pet $pet)
    {
        Gate::authorize('view', $pet);

        return Inertia::render('Owner/Pets/Health/Create', [
            'pet' => $pet,
        ]);
    }

    public function show(Request $request, Pet $pet, HealthRecord $healthRecord)
    {
        if ($healthRecord->pet_id !== $pet->id) {
            abort(404);
        }

        Gate::authorize('view', $healthRecord);

        return Inertia::render('Owner/Pets/Health/Show', [
            'pet' => $pet,
            'record' => $healthRecord->load('vet'),
        ]);
    }

    public function edit(Request $request, Pet $pet, HealthRecord $healthRecord)
    {
        if ($healthRecord->pet_id !== $pet->id) {
            abort(404);
        }

        Gate::authorize('update', $healthRecord);

        return Inertia::render('Owner/Pets/Health/Edit', [
            'record' => $healthRecord->load('vet'),
            'pet' => $pet,
        ]);
    }

    public function store(Request $request, Pet $pet)
    {   Gate::authorize('update', $pet);

        $validated = $request->validate([
            'visit_date' => 'required|date',
            'title' => 'nullable|string|max:191',
            'diagnosis' => 'nullable|string|max:2000',
            'treatment' => 'nullable|string|max:4000',
            'attachments.*' => 'nullable|file|mimes:pdf,jpg,png,jpeg|max:8192',
        ]);
            $record = HealthRecord::create([
                'pet_id' => $pet->id,
                // 'vet_id' => $request->vet_id, 
                'visit_date' => $validated['visit_date'],
                'title' => $validated['title'] ?? null,
                'diagnosis' => $validated['diagnosis'] ?? null,
                'treatment' => $validated['treatment'] ?? null,
            ]);
            
            // dd($record);
            if ($request->hasFile('attachments')) {
                $paths = [];
                foreach ((array)$request->file('attachments') as $file) {
                    $paths[] = $file->store('health-records', 'public');
                }

                $record->attachments = $paths;
                $record->save();
            } 

            return redirect()->route('owner.pets.show',$pet->slug)->with('success', 'Health record added.');

    }

    public function update(Request $request, Pet $pet, HealthRecord $healthRecord)
    {
        // ensure the health record belongs to this pet
        if ($healthRecord->pet_id !== $pet->id) {
            abort(404);
        }

        Gate::authorize('update', $healthRecord);

        $validated = $request->validate([
            'visit_date' => 'nullable|date',
            'title' => 'nullable|string|max:191',
            'diagnosis' => 'nullable|string|max:2000',
            'treatment' => 'nullable|string|max:4000',
            'attachments.*' => 'nullable|file|mimes:pdf,jpg,png,jpeg|max:8192',
            'remove_attachments' => 'nullable|array',
            'remove_attachments.*' => 'nullable|string',
        ]);

        DB::beginTransaction();
        try {
            $healthRecord->fill([
                'visit_date' => $validated['visit_date'] ?? $healthRecord->visit_date,
                'title' => $validated['title'] ?? $healthRecord->title,
                'diagnosis' => $validated['diagnosis'] ?? $healthRecord->diagnosis,
                'treatment' => $validated['treatment'] ?? $healthRecord->treatment,
            ]);
            if (!empty($validated['remove_attachments'])) {
                $remove = (array)$validated['remove_attachments'];
                $current = $healthRecord->attachments ?? [];

                $kept = [];
                foreach ($current as $p) {
                    if (in_array($p, $remove, true)) {
                        // delete file from storage if exists
                        if (is_string($p) && Storage::disk('public')->exists($p)) {
                            Storage::disk('public')->delete($p);
                        }
                    } else {
                        $kept[] = $p;
                    }
                }

                $healthRecord->attachments = array_values($kept);
            }
            if ($request->hasFile('attachments')) {
                $paths = $healthRecord->attachments ?? [];
                foreach ((array)$request->file('attachments') as $file) {
                    $paths[] = $file->store('health-records', 'public');
                }
                $healthRecord->attachments = $paths;
            }

            $healthRecord->save();

            DB::commit();

            return back()->with('success', 'Health record updated.');
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('Health record update failed: ' . $e->getMessage());
            return back()->with('error', 'Failed to update health record.');
        }
    }

    /**
     * Delete a health record
     */
    public function destroy(Request $request, Pet $pet, HealthRecord $healthRecord)
    {
           if ($healthRecord->pet_id !== $pet->id) {
            abort(404);
        }

        Gate::authorize('delete', $healthRecord);

        try {
            foreach ($healthRecord->attachments ?? [] as $path) {
                if (is_string($path) && Storage::disk('public')->exists($path)) {
                    Storage::disk('public')->delete($path);
                }
            }

            $healthRecord->delete();

            return back()->with('success', 'Health record removed.');
        } catch (\Throwable $e) {
            Log::error('Health record delete failed: ' . $e->getMessage());
            return back()->with('error', 'Failed to delete health record.');
        }
    }
}
