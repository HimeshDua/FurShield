<?php

namespace App\Http\Controllers\Shelter;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ProductController extends Controller
{
    use AuthorizesRequests;

    public function index(Request $request)
    {
        $user = $request->user();
        $products = $user->products()->where('owner_id', Auth::id())->with('images')->latest()->paginate(12);

        return Inertia::render('Shelter/Products/Index', [
            'products' => $products,
        ]);
    }

    public function create()
    {
        return Inertia::render('Shelter/Products/Create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'nullable|string|max:100',
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'unique:products,slug,' . ',id,owner_id,' . Auth::id(),
            'stock_quantity' => 'nullable|integer|min:0',
            'images.*' => 'nullable|image|max:4096'
        ]);
        
        $product = Product::create(array_merge($data, ['owner_id' => Auth::id() ]));

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $path = $file->store('product_images', 'public');
                ProductImage::create([
                    'product_id' => $product->id,
                    'path' => $path
                ]);
            }
        }

        return redirect()->route('shelter.products.index')
            ->with('success', 'Product created successfully.');
    }

    public function edit(Product $product)
    {
        // $this->authorize('update', $product);

        return Inertia::render('Shelter/Products/Edit', [
            'product' => $product,
        ]);
    }

    public function update(Request $request, Product $product)
    {
        // $this->authorize('update', $product);

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'nullable|string|max:100',
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'stock_quantity' => 'nullable|integer|min:0',
        ]);

        $product->update($data);

        return redirect()->route('shelter.products.index')
            ->with('success', 'Product updated successfully.');
    }

    public function destroy(Product $product)
    {
        // $this->authorize('delete', $product);
        $product->delete();

        return back()->with('success', 'Product deleted.');
    }
}