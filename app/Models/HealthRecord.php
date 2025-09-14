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
        'attachments' => 'array',
    ];

    public function pet()
    {
        return $this->belongsTo(Pet::class);
    }

    public function vet()
    {
        return $this->belongsTo(User::class, 'vet_id');
    }
}
