<?php

namespace App\Http\Controllers\Customer;

use App\Models\CustomerSubscription;
use App\Models\CustomerTransaction;
use App\Models\OwnerTransaction;
use App\Models\Product;
use App\Models\User;
use App\Models\VendorService;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OrderController
{
    public function index()
    {
        $owner_id = Auth::id();
        $transactions = OwnerTransaction::with('product')
            ->where('owner_id', $owner_id)
            ->latest()
            ->paginate(10);

        return Inertia::render('Owner/Orders/Index', [
            'orders' => $transactions
        ]);
    }

    public function show(OwnerTransaction $transaction)
    {
        $this->authorize('view', $transaction);

        $transaction->load('product');

        return Inertia::render('Owner/Orders/Show', [
            'order' => $transaction
        ]);
    }
}
