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
        $user_id = Auth::user()->id;
        $products = Product::where('vendor_id', $user_id)->get();
        // ->paginate(10);

        return Inertia::render('Products/Index', [
            'products' => $products ?? []
        ]);
    }
}
