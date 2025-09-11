<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Review;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class ProductController extends Controller
{
    use AuthorizesRequests;
    public function index(Request $request)
    {
        $q = $request->get('q');
        $products = Product::when($q, fn($qBuilder) => $qBuilder->where('name', 'like', "%{$q}%"))
            ->with('images')
            ->paginate(12);

        return Inertia::render('Products/Index', ['products' => $products]);
    }

    public function show(Product $product)
    {
        $product->load('images', 'reviews.user');
        return Inertia::render('Products/Show', ['product' => $product]);
    }

    public function store(Request $request)
    {
        Gate::authorize('create', Product::class);

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'nullable|string|max:100',
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'stock_quantity' => 'nullable|integer|min:0',
        ]);

        $product = Product::create(array_merge($data, [
            'vendor_id' => $request->user()->id,
            'slug' => Str::slug($data['name']) . '-' . substr(uniqid(), -6),
        ]));

        return redirect()->route('products.show', $product)->with('success', 'Product created.');
    }

    // simple review endpoint
    public function review(Request $request, Product $product)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:2000'
        ]);

        // can be any authenticated user (owner/vet/shelter)
        Review::updateOrCreate(
            ['user_id' => $request->user()->id, 'reviewable_type' => Product::class, 'reviewable_id' => $product->id],
            ['rating' => $request->rating, 'comment' => $request->comment]
        );

        return redirect()->back()->with('success', 'Thanks for your review.');
    }
}
