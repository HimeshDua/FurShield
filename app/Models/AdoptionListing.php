<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class AdoptionListing extends Model
{
    protected $fillable = [
        'shelter_id',
        'pet_name',
        'species',
        'slug',
        'breed',
        'age',
        'status',
        'description',
        'images'
    ];

    protected $casts = ['images' => 'array'];


    public function getRouteKeyName()
    {
        return 'slug';
    }


    public function images()
    {
        return $this->hasMany(PetImage::class);
    }

    public function shelter()
    {
        return $this->belongsTo(User::class, 'shelter_id');
    }

    protected static function booted()
    {
        static::creating(function ($model) {
            $model->slug = static::generateUniqueSlug($model->pet_name);
        });

        static::updating(function ($model) {
            if ($model->isDirty('pet_name')) {
                $model->slug = static::generateUniqueSlug($model->pet_name);
            }
        });
    }

    protected static function generateUniqueSlug($pet_name)
    {
        $slug = Str::slug($pet_name);
        $count = static::where('slug', 'like', "{$slug}%")->count();
        return $count ? "{$slug}-{$count}" : $slug;
    }
}
