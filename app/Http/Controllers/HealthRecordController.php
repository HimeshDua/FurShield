<?php

namespace App\Http\Controllers;

use App\Models\HealthRecord;
use App\Models\Pet;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class HealthRecordController extends Controller
{
    use AuthorizesRequests;
    public function indexForPet(Request $request, Pet $pet)
    {
        $this->authorize('viewAny', [HealthRecord::class, $pet]);

        $records = $pet->healthRecords()->with('vet')->latest()->paginate(12);

        return Inertia::render('Pets/Health/Index', [
            'pet' => $pet,
            'records' => $records,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'pet_id' => 'required|exists:pets,id',
            'visit_date' => 'nullable|date',
            'title' => 'nullable|string|max:255',
            'diagnosis' => 'nullable|string',
            'treatment' => 'nullable|string',
            'attachments.*' => 'nullable|file|max:8192'
        ]);

        $pet = Pet::findOrFail($data['pet_id']);
        $this->authorize('create', [HealthRecord::class, $pet]);

        $attachments = [];
        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                $attachments[] = $file->store('health_records', 'public');
            }
        }

        $record = HealthRecord::create([
            'pet_id' => $pet->id,
            'vet_id' => $request->user()->isVet() ? $request->user()->id : null,
            'visit_date' => $data['visit_date'] ?? now(),
            'title' => $data['title'] ?? null,
            'diagnosis' => $data['diagnosis'] ?? null,
            'treatment' => $data['treatment'] ?? null,
            'attachments' => $attachments,
        ]);

        return redirect()->back()->with('success', 'Health record saved.');
    }

    public function update(Request $request, HealthRecord $healthRecord)
    {
        $this->authorize('update', $healthRecord);

        $data = $request->validate([
            'visit_date' => 'nullable|date',
            'title' => 'nullable|string|max:255',
            'diagnosis' => 'nullable|string',
            'treatment' => 'nullable|string',
            'attachments.*' => 'nullable|file|max:8192'
        ]);

        $attachments = $healthRecord->attachments ?? [];
        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                $attachments[] = $file->store('health_records', 'public');
            }
        }

        $healthRecord->update(array_merge($data, ['attachments' => $attachments]));

        return redirect()->back()->with('success', 'Record updated.');
    }

    public function destroy(HealthRecord $healthRecord)
    {
        $this->authorize('delete', $healthRecord);

        // Optionally remove attachments (left simple)
        $healthRecord->delete();

        return redirect()->back()->with('success', 'Record deleted.');
    }
}
