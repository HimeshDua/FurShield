<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Product;
use App\Models\OwnerTransaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CartController extends Controller
{
    public function index()
    {
        $cartItems = Cart::with('product')
            ->where('owner_id', Auth::id())
            ->get();

        return Inertia::render('Owner/Cart/Index', [
            'cartItems' => $cartItems,
        ]);
    }

    public function add(Request $request, Product $product)
    {
        $data = $request->validate([
            'quantity' => 'nullable|integer|min:1',
        ]);

        $quantity = $data['quantity'] ?? 1;

        $cartItem = Cart::updateOrCreate(
            ['owner_id' => Auth::id(), 'product_id' => $product->id],
            ['quantity' => DB::raw("quantity + $quantity")]
        );

        return back()->with('success', 'Product added to cart.');
    }

    public function remove(Product $product)
    {
        Cart::where('owner_id', Auth::id())
            ->where('product_id', $product->id)
            ->delete();

        return back()->with('success', 'Item removed.');
    }

    public function checkout()
    {
        $cartItems = Cart::with('product')->where('owner_id', Auth::id())->get();

        foreach ($cartItems as $item) {
            OwnerTransaction::create([
                'owner_id' => Auth::id(),
                'product_id' => $item->product_id,
                'amount' => $item->product->price * $item->quantity,
                'currency' => 'USD',
                'status' => 'completed',
            ]);

            // reduce stock
            $item->product->decrement('stock_quantity', $item->quantity);
        }

        Cart::where('owner_id', Auth::id())->delete();

        return redirect()->route('owner.orders.index')->with('success', 'Checkout successful!');
    }
}
