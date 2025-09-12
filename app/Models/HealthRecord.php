<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class HealthRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'pet_id',
        'vet_id',
        'visit_date',
        'title',
        'diagnosis',
        'treatment',
        'attachments',
    ];

    protected $casts = [
        'visit_date' => 'date',
        'attachments' => 'array', // will automatically decode/encode JSON
    ];

    /**
     * Relationship: A health record belongs to a pet.
     */
    public function pet()
    {
        return $this->belongsTo(Pet::class);
    }

    /**
     * Relationship: A health record may be created by/linked to a vet (user).
     */
    public function vet()
    {
        return $this->belongsTo(User::class, 'vet_id');
    }
}
