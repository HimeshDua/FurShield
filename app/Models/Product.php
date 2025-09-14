<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Product extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'owner_id',
        'name',
        'slug',
        'category',
        'price',
        'description',
        'stock_quantity',
        'metadata'
    ];

    protected $casts = [
        'metadata' => 'array'
    ];

    public function images()
    {
        return $this->hasMany(ProductImage::class);
    }
    public function shelter()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }
    public function reviews()
    {
        return $this->morphMany(Review::class, 'reviewable');
    }

    public function getRouteKeyName()
    {
        return 'slug';
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