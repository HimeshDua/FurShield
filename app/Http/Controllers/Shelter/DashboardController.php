<?php

namespace App\Http\Controllers\Shelter;

use App\Http\Controllers\Controller;
use App\Models\AdoptionListing;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $shelterId = Auth::id();

        // Only listings created by this shelter
        $adoptions = AdoptionListing::where('shelter_id', $shelterId)
            ->latest()
            ->take(6)
            ->get();

        // Only products created by this shelter
        $products = Product::where('owner_id', $shelterId)
            ->with('images')
            ->latest()
            ->take(6)
            ->get();

        // Stats
        $stats = [
            'total_adoptions' => AdoptionListing::where('shelter_id', $shelterId)->count(),
            'available_adoptions' => AdoptionListing::where('shelter_id', $shelterId)->where('status', 'available')->count(),
            'total_products' => Product::where('owner_id', $shelterId)->count(),
        ];

        return Inertia::render('Shelter/Dashboard', [
            'adoptions' => $adoptions,
            'products' => $products,
            'stats' => $stats,
        ]);
    }
}
