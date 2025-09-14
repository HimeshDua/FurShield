<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Pet extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'owner_id',
        'name',
        'species',
        'slug',
        'breed',
        'birth_date',
        'gender',
        'weight_kg',
        'microchip',
        'next_vaccination_at',
        'next_food_at',
        'notes'
    ];

    protected $casts = [
        'birth_date' => 'date',
        'next_vaccination_at' => 'datetime',
        'next_food_at' => 'datetime',
    ];

    public function getRouteKeyName()
    {
        return 'slug';
    }

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

    protected static function booted()
    {
        static::creating(function ($model) {
            $model->slug = static::generateUniqueSlug($model->name);
        });

        static::updating(function ($model) {
            if ($model->isDirty('name')) {
                $model->slug = static::generateUniqueSlug($model->name);
            }
        });
    }

    protected static function generateUniqueSlug($name)
    {
        $slug = Str::slug($name);
        $count = static::where('slug', 'like', "{$slug}%")->count();
        return $count ? "{$slug}-{$count}" : $slug;
    }
}
