<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'search' => 'nullable|string|max:255',
            'category' => 'nullable|string|max:100',
            'sort' => 'nullable|string|in:price-asc,price-desc,name-asc,name-desc,newest',
            'page' => 'nullable|integer|min:1',
        ]);

        $search = $request->input('search');
        $category = $request->input('category');
        $sort = $request->input('sort', 'newest'); 
        $perPage = 12;

        $query = Product::query()
            ->with(['images', 'shelter'])
            ->whereNull('deleted_at');   

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                  ->orWhere('description', 'like', '%' . $search . '%');
            });
        }

        if ($category && $category !== 'all') {
            $query->where('category', $category);
        }

        // Sorting
        switch ($sort) {
            case 'price-asc':
                $query->orderBy('price', 'asc');
                break;
            case 'price-desc':
                $query->orderBy('price', 'desc');
                break;
            case 'name-asc':
                $query->orderBy('name', 'asc');
                break;
            case 'name-desc':
                $query->orderBy('name', 'desc');
                break;
            case 'newest':
            default:
                $query->orderBy('created_at', 'desc');
                break;
        }

        $products = $query->paginate($perPage)->withQueryString();

        // categories for the filter UI (only non-null)
        $categories = Product::query()
            ->select('category')
            ->whereNotNull('category')
            ->distinct()
            ->orderBy('category')
            ->pluck('category');

        return Inertia::render('Public/Products/Index', [
            'products' => $products,
            // current filters so the frontend can reflect them in inputs/selects
            'filters' => [
                'search' => $search,
                'category' => $category,
                'sort' => $sort,
            ],
            'categories' => $categories,
        ]);
    }

  
    public function show(Request $request, Product $product)
    {
        $product->load(['images', 'shelter', 'reviews']);

        // Related products (same category) — small selection to show on product page
        $related = Product::query()
            ->with('images')
            ->where('category', $product->category)
            ->where('id', '!=', $product->id)
            ->whereNull('deleted_at')
            ->limit(6)
            ->get();

        return Inertia::render('Public/Products/Show', [
            'product' => $product,
            'related' => $related,
        ]);
    }
}
