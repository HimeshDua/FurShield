<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Pet;
use App\Models\Appointment;
use App\Models\Order;

class DashboardController extends Controller
{
    /**
     * Show owner's dashboard with summary cards: pets, upcoming appointments, recent orders.
     */
    public function index(Request $request)
    {
        $userId = Auth::user()->id;
        $isPet = Pet::where('owner_id', $userId)->first();
        if (!$isPet) {
            return redirect()->route('owner.pets.create')->with('error', 'Submit Details about your Pet to view dashboard');
        }
        $user = $request->user();

        // Load pets and limit some data for the dashboard
        $pets = Pet::where('owner_id', $user->id)
            ->withCount('healthRecords')
            ->orderBy('created_at', 'desc')
            ->take(6)
            ->get();

        $upcomingAppointments = Appointment::with(['pet', 'vet'])
            ->where('owner_id', $user->id)
            ->whereIn('status', ['pending', 'approved'])
            ->where('appointment_time', '>=', now())
            ->orderBy('appointment_time', 'asc')
            ->take(6)
            ->get();

        $recentOrders = Order::where('owner_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        return Inertia::render('Owner/Dashboard', [
            'pets' => $pets ?? [],
            'appointments' => $upcomingAppointments ?? [],
            'orders' => $recentOrders ?? [],
        ]);
    }
}
