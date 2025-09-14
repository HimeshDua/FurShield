<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OwnerTransaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'owner_id',
        'product_id',
        'subscribed_at',
        'payment_date',
        'currency',
        'amount',
        'status',
    ];

    protected $casts = [
        'payment_date' => 'datetime',
        'amount' => 'decimal:2',
    ];

    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function product(){
        return $this->hasMany(Product::class,'owner_id');
    }

    public function isRefunded(): bool
    {
        return $this->status === 'refunded';
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }
}
