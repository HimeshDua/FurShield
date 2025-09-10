<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = ['owner_id', 'total_amount', 'status', 'order_date', 'metadata'];

    protected $casts = ['order_date' => 'datetime', 'metadata' => 'array'];

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }
    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}
