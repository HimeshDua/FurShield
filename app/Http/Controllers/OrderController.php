<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use DB;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class OrderController extends Controller
{
    use AuthorizesRequests;
    public function index(Request $request)
    {
        $orders = $request->user()->orders()->with('items.product')->paginate(12);
        return Inertia::render('Orders/Index', ['orders' => $orders]);
    }

    public function show(Order $order)
    {
        $this->authorize('view', $order);
        $order->load('items.product');
        return Inertia::render('Orders/Show', ['order' => $order]);
    }

    // simple cart->order creation for hackathon (no payment)
    public function store(Request $request)
    {
        $data = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1'
        ]);

        DB::beginTransaction();
        try {
            $total = 0;
            $order = Order::create([
                'owner_id' => $request->user()->id,
                'total_amount' => 0,
                'status' => 'processing',
            ]);

            foreach ($data['items'] as $it) {
                $product = Product::findOrFail($it['product_id']);
                $qty = $it['quantity'];
                $price = $product->price;
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $qty,
                    'price_each' => $price
                ]);
                $total += $price * $qty;

                // optionally reduce stock
                if ($product->stock_quantity > 0) {
                    $product->decrement('stock_quantity', $qty);
                }
            }

            $order->update(['total_amount' => $total]);
            DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();
            throw $e;
        }

        return redirect()->route('orders.show', $order)->with('success', 'Order placed (demo).');
    }
}
