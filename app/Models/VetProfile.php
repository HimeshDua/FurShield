<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VetProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'specializations', 'qualifications', 'availability', 'consultation_fee', 'clinic_address'];

    protected $casts = [
        'specializations' => 'array',
        'availability' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
