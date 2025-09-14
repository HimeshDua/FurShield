<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    protected $fillable = [
        'pet_id',
         'owner_id',
          'vet_id',
           'appointment_time',
            'status', 'reason', 'notes', 'duration_minutes'];

    protected $casts = ['appointment_time' => 'datetime'];

    public function pet()
    {
        return $this->belongsTo(Pet::class);
    }
    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }
    public function vet()
    {
        return $this->belongsTo(User::class, 'vet_id');
    }
}
