<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShelterProfile extends Model
{
    protected $fillable = ['user_id', 'location', 'mission', 'contact_email'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
