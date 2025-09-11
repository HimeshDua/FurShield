<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


use App\Http\Controllers\PetController;
use App\Http\Controllers\HealthRecordController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\AdoptionListingController;
use App\Http\Controllers\VetProfileController;
use App\Http\Controllers\ShelterProfileController;

// Owner dashboard controller (create App\Http\Controllers\Owner\DashboardController)
use App\Http\Controllers\Owner\DashboardController;

// Optional / admin controllers (create if needed)
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\UserManagementController;

// Misc (optional)
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;

/*
|--------------------------------------------------------------------------
| Public routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return Inertia::render('Public/Home');
})->name('home');

Route::get('/about', fn() => Inertia::render('Public/About'))->name('about');
// Route::get('/contact', fn () => Inertia::render('Public/Contact'))->name('contact');
// Route::get('/services', fn () => Inertia::render('Public/Services'))->name('services');

/*
|--------------------------------------------------------------------------
| Authentication & Settings
|--------------------------------------------------------------------------
| Keep your auth scaffolding (Breeze/Fortify) in auth.php. settings.php can
| contain user preferences, privacy settings, or feature flags.
*/
require __DIR__ . '/auth.php';
require __DIR__ . '/settings.php';

/*
|--------------------------------------------------------------------------
| Public read routes (guests can browse these)
|--------------------------------------------------------------------------
| Products, vets and adoptions are intentionally public for browse/discovery.
*/
Route::get('products', [ProductController::class, 'index'])->name('products.index');
Route::get('products/{product}', [ProductController::class, 'show'])->name('products.show');
Route::get('vets', [VetProfileController::class, 'index'])->name('vets.index');
Route::get('vets/{vet}', [VetProfileController::class, 'show'])->name('vets.show');
Route::get('adoptions', [AdoptionListingController::class, 'index'])->name('adoptions.index');
Route::get('adoptions/{adoption}', [AdoptionListingController::class, 'show'])->name('adoptions.show');

/*
|--------------------------------------------------------------------------
| Authenticated routes (all users must be logged in)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth'])->group(function () {


    Route::middleware(['redirect.role'])->get('/dashboard', fn() => null)->name('dashboard');
    /*
    |--------------------------------------------------------------------------
    | Common authenticated utility routes
    |--------------------------------------------------------------------------
    | Profile, notifications, search, cart/checkout (demo).
    */
    Route::get('/profile', [ProfileController::class, 'show'])->name('profile.show');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');

    // Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    // Route::post('/notifications/{id}/read', [NotificationController::class, 'markRead'])->name('notifications.read');

    // Route::get('/search', [SearchController::class, 'index'])->name('search.index');

    // Cart & demo checkout (no payment integration)
    // Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
    // Route::post('/cart/add', [CartController::class, 'add'])->name('cart.add');
    // Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');

    /*
    |--------------------------------------------------------------------------
    | OWNER ROUTES (role:owner)
    |--------------------------------------------------------------------------
    | Manage pets, view pet health timeline, book appointments, and orders
    */

    Route::middleware('role:owner')->prefix('owner')->name('owner.')->group(function () {
        // Owner dashboard (create controller App\Http\Controllers\Owner\DashboardController)
        Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

        // Pets CRUD (resourceful)
        Route::resource('pets', PetController::class);

        // Owner views pet's health records (timeline)
        Route::get('pets/{pet}/health', [HealthRecordController::class, 'indexForPet'])
            ->name('pets.health.index');

        // Book an appointment for a pet (owner posts a booking request)
        Route::post('appointments/{pet}', [AppointmentController::class, 'bookForPet'])
            ->name('appointments.book');

        // Orders (demo checkout)
        Route::resource('orders', OrderController::class)->only(['index', 'show', 'store']);
    });

    /*
    |--------------------------------------------------------------------------
    | VET ROUTES (role:vet)
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:vet')->prefix('vet')->name('vet.')->group(function () {
        // Vet appointment calendar/list
        Route::get('appointments', [AppointmentController::class, 'vetIndex'])
            ->name('appointments.index');

        // Approve, reschedule, cancel appointment (actions)
        Route::patch('appointments/{appointment}/approve', [AppointmentController::class, 'approve'])
            ->name('appointments.approve');
        Route::patch('appointments/{appointment}/reschedule', [AppointmentController::class, 'reschedule'])
            ->name('appointments.reschedule');
        Route::patch('appointments/{appointment}/cancel', [AppointmentController::class, 'cancel'])
            ->name('appointments.cancel');

        // Health records (vet creates/updates/deletes)
        Route::resource('health-records', HealthRecordController::class)
            ->only(['store', 'update', 'destroy']);

        // Vet profile (view & update own professional profile)
        Route::resource('vet-profile', VetProfileController::class)
            ->only(['show', 'update']);
    });

    /*
    |--------------------------------------------------------------------------
    | SHELTER ROUTES (role:shelter)
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:shelter')->prefix('shelter')->name('shelter.')->group(function () {
        // Adoption CRUD (shelter manages listings)
        Route::resource('adoptions', AdoptionListingController::class);

        // Shelter profile
        Route::resource('shelter-profile', ShelterProfileController::class)
            ->only(['show', 'update']);
    });

    /*
    |--------------------------------------------------------------------------
    | Common authenticated read/write endpoints (accessible to any logged-in user)
    |--------------------------------------------------------------------------
    | Posting product reviews requires auth — handled by ProductController@review.
    */
    Route::post('products/{product}/reviews', [ProductController::class, 'review'])
        ->name('products.review');

    // Optional: authenticated-only adoption interest form (owner expresses interest)
    Route::post('adoptions/{adoption}/interest', [AdoptionListingController::class, 'expressInterest'])
        ->name('adoptions.interest');
});

/*
|--------------------------------------------------------------------------
| ADMIN ROUTES (role:admin) — protect these routes with role middleware
|--------------------------------------------------------------------------
*/
// Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
//     // Admin dashboard (create App\Http\Controllers\Admin\AdminDashboardController)
//     Route::get('dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

//     // Basic user management
//     Route::resource('users', UserManagementController::class)->only(['index', 'edit', 'update', 'destroy']);

//     // Add other admin controllers/routes as necessary (content moderation, analytics)
// });

/*
|--------------------------------------------------------------------------
| Health check & fallback
|--------------------------------------------------------------------------
*/
Route::get('/health', fn() => response()->json(['status' => 'ok']));

Route::fallback(function () {
    // For unknown routes, show a friendly 404 Inertia page (create Errors/NotFound)
    return Inertia::render('Errors/NotFound')->toResponse(request())->setStatusCode(404);
});
