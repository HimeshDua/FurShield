<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AdoptionListing extends Model
{
    protected $fillable = ['shelter_id', 'pet_name', 'species', 'breed', 'age', 'status', 'description', 'images'];

    protected $casts = ['images' => 'array'];

    public function shelter()
    {
        return $this->belongsTo(User::class, 'shelter_id');
    }
}
