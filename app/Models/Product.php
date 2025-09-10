<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use SoftDeletes;

    protected $fillable = ['vendor_id', 'name', 'slug', 'category', 'price', 'description', 'stock_quantity', 'metadata'];

    protected $casts = ['metadata' => 'array'];

    public function images()
    {
        return $this->hasMany(ProductImage::class);
    }
    public function vendor()
    {
        return $this->belongsTo(User::class, 'vendor_id');
    }
    public function reviews()
    {
        return $this->morphMany(Review::class, 'reviewable');
    }
}
