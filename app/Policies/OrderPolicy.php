<?php

namespace App\Policies;

use App\Models\Order;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class OrderPolicy
{
    use HandlesAuthorization;

    public function view(User $user, Order $order)
    {
        return $user->id === $order->owner_id || $user->role === 'admin';
    }

    public function create(User $user)
    {
        return $user->isOwner() || $user->role === 'admin';
    }
}
