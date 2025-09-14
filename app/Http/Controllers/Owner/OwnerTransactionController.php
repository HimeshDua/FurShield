<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Models\OwnerTransaction;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class OwnerTransactionController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'amount' => 'required|numeric|min:0',
            'currency' => 'required|string|size:3',
        ]);

        $product = Product::findOrFail($validated['product_id']);

        if ($product->stock_quantity <= 0) {
            throw ValidationException::withMessages([
                'product_id' => 'Product is out of stock.'
            ]);
        }
        OwnerTransaction::create([
            'owner_id' => $request->user()->id,
            'product_id' => $product->id,
            'amount' => $validated['amount'],
            'currency' => $validated['currency'],
            'status' => 'completed',
        ]);

        $product->decrement('stock_quantity');
        return back()->with('success', 'Purchase completed successfully.');
    }
}
