<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Pet extends Model
{
    use SoftDeletes;

    protected $fillable = ['owner_id', 'name', 'species', 'breed', 'birth_date', 'gender', 'weight_kg', 'microchip', 'notes'];

    protected $casts = [
        'birth_date' => 'date',
    ];

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function images()
    {
        return $this->hasMany(PetImage::class);
    }

    public function healthRecords()
    {
        return $this->hasMany(HealthRecord::class);
    }

    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }
}
