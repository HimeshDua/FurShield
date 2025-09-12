<?php

namespace App\Http\Controllers\Shelter;

use App\Http\Controllers\Controller;
use App\Models\AdoptionListing;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $shelterId = Auth::id();

        $stats = [
            'adoptions' => AdoptionListing::where('shelter_id', $shelterId)->count(),
            'products' => Product::where('owner_id', $shelterId)->count(),
            'pendingAdoptions' => AdoptionListing::where('shelter_id', $shelterId)->where('status', 'pending')->count(),
        ];

        $latestAdoptions = AdoptionListing::where('shelter_id', $shelterId)
            ->latest()->take(5)->get();

        $latestProducts = Product::where('owner_id', $shelterId)
            ->latest()->take(5)->get();

        $shelterData = [
            'stats' => $stats,
            'latestAdoptions' => $latestAdoptions,
            'latestProducts' => $latestProducts,
        ];
        return Inertia::render('Shelter/Dashboard', ['shelterData' => $shelterData]);
    }
}
