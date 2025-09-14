<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Models\OwnerTransaction;
use Illuminate\Foundation\Auth\Access\Authorizable;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OrderController extends Controller
{
    use AuthorizesRequests;


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
