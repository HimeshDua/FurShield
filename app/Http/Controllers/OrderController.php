<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{
    public function __construct()
    {
        Gate::middleware('auth');
    }

    /**
     * List owner's orders
     */
    public function index(Request $request)
    {
        $orders = Order::where('owner_id', $request->user()->id)
            ->withCount('items')
            ->orderBy('created_at', 'desc')
            ->paginate(12);

        return Inertia::render('Owner/Orders/Index', [
            'orders' => $orders,
        ]);
    }

    /**
     * Show order details
     */
    public function show(Request $request, Order $order)
    {
        Gate::authorize('view', $order);

        $order->load('items.product');

        return Inertia::render('Owner/Orders/Show', [
            'order' => $order,
        ]);
    }

    /**
     * Create a demo order. Accepts payload: items => [{product_id, quantity}]
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|integer|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        $user = $request->user();

        DB::beginTransaction();
        try {
            $total = 0;
            $order = Order::create([
                'owner_id' => $user->id,
                'total_amount' => 0,
                'status' => 'processing',
            ]);

            foreach ($validated['items'] as $item) {
                $product = Product::lockForUpdate()->find($item['product_id']);

                if (!$product) {
                    throw new \Exception("Product not found: {$item['product_id']}");
                }

                // if stock is maintained, reduce it; allow backorders if you prefer
                if (!is_null($product->stock_quantity) && $product->stock_quantity < $item['quantity']) {
                    throw new \Exception("Insufficient stock for product: {$product->name}");
                }

                // decrement stock safely
                if (!is_null($product->stock_quantity)) {
                    $product->decrement('stock_quantity', $item['quantity']);
                }

                $priceEach = $product->price;
                $lineTotal = $priceEach * $item['quantity'];
                $total += $lineTotal;

                $order->items()->create([
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'price_each' => $priceEach,
                ]);
            }

            $order->total_amount = $total;
            $order->save();

            DB::commit();

            return redirect()->route('owner.orders.show', $order->id)
                ->with('success', 'Order created (demo).');
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('Order creation failed: ' . $e->getMessage());
            return back()->with('error', 'Failed to create order: ' . $e->getMessage());
        }
    }
}
