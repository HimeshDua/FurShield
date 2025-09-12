<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProductController extends Controller
{

    public function index()
    {
        $products = Product::latest()->paginate(10);
        return Inertia::render('Public/Products/Index', [
            'products' => $products,
        ]);
    }

    public function show(Product $product)
    {
        // Gate::authorize('view', $pet);
        $product->load(['images', 'shelter', 'reviews']);
        return Inertia::render('Public/Products/Show', [
            'product' => $product
        ]);
    }
}
