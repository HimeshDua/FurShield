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
    public function __construct()
    {
        Gate::middleware('auth');
    }

    /**
     * Owner: list health records for a given pet (timeline).
     */
    public function indexForPet(Request $request, Pet $pet)
    {
        // ensure owner owns the pet
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

    /**
     * Vet: store a new health record (vet-only route)
     */
    public function store(Request $request)
    {
        Gate::authorize('create', HealthRecord::class);

        $validated = $request->validate([
            'pet_id' => 'required|integer|exists:pets,id',
            'visit_date' => 'required|date',
            'title' => 'nullable|string|max:191',
            'diagnosis' => 'nullable|string|max:2000',
            'treatment' => 'nullable|string|max:4000',
            'attachments.*' => 'nullable|file|mimes:pdf,jpg,png,jpeg|max:8192',
        ]);

        DB::beginTransaction();
        try {
            $record = HealthRecord::create([
                'pet_id' => $validated['pet_id'],
                'vet_id' => $request->user()->id,
                'visit_date' => $validated['visit_date'],
                'title' => $validated['title'] ?? null,
                'diagnosis' => $validated['diagnosis'] ?? null,
                'treatment' => $validated['treatment'] ?? null,
            ]);

            if ($request->hasFile('attachments')) {
                $paths = [];
                foreach ($request->file('attachments') as $file) {
                    $paths[] = $file->store('health-records', 'public');
                }
                // store as JSON array in a attachments text field (or related model)
                $record->attachments = $paths;
                $record->save();
            }

            DB::commit();

            return back()->with('success', 'Health record added.');
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('Health record store failed: ' . $e->getMessage());
            return back()->with('error', 'Failed to save health record.');
        }
    }

    /**
     * Vet: update a health record
     */
    public function update(Request $request, HealthRecord $healthRecord)
    {
        Gate::authorize('update', $healthRecord);

        $validated = $request->validate([
            'visit_date' => 'nullable|date',
            'title' => 'nullable|string|max:191',
            'diagnosis' => 'nullable|string|max:2000',
            'treatment' => 'nullable|string|max:4000',
            'attachments.*' => 'nullable|file|mimes:pdf,jpg,png,jpeg|max:8192',
            'remove_attachments' => 'nullable|array',
        ]);

        DB::beginTransaction();
        try {
            $healthRecord->fill([
                'visit_date' => $validated['visit_date'] ?? $healthRecord->visit_date,
                'title' => $validated['title'] ?? $healthRecord->title,
                'diagnosis' => $validated['diagnosis'] ?? $healthRecord->diagnosis,
                'treatment' => $validated['treatment'] ?? $healthRecord->treatment,
            ]);

            // remove specific attachments if requested
            if (!empty($validated['remove_attachments'])) {
                $remove = $validated['remove_attachments'];
                $healthRecord->attachments = array_values(array_filter($healthRecord->attachments ?? [], function ($p) use ($remove) {
                    return !in_array($p, $remove);
                }));
            }

            if ($request->hasFile('attachments')) {
                $paths = $healthRecord->attachments ?? [];
                foreach ($request->file('attachments') as $file) {
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
     * Vet: delete a health record
     */
    public function destroy(HealthRecord $healthRecord)
    {
        Gate::authorize('delete', $healthRecord);

        try {
            // delete attachments files
            foreach ($healthRecord->attachments ?? [] as $path) {
                Storage::disk('public')->delete($path);
            }

            $healthRecord->delete();

            return back()->with('success', 'Health record removed.');
        } catch (\Throwable $e) {
            Log::error('Health record delete failed: ' . $e->getMessage());
            return back()->with('error', 'Failed to delete health record.');
        }
    }
}
