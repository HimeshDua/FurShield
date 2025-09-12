<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Owner\DashboardController;
use App\Http\Controllers\HealthRecordController;
use App\Http\Controllers\Owner\AppointmentController;
use App\Http\Controllers\Owner\OrderController;
use App\Http\Controllers\Owner\ProductController;
use App\Http\Controllers\Owner\PetController;
use App\Http\Controllers\Public\ProductController as PublicProductController;
use App\Http\Controllers\Shared\ProfileController;
use App\Http\Controllers\Shelter\AdoptionListingController;
use App\Http\Controllers\Shelter\ShelterProfileController;
use App\Http\Controllers\ShelterController;
use App\Http\Controllers\VetProfileController;






/*
|--------------------------------------------------------------------------
| Public routes
|--------------------------------------------------------------------------
*/

Route::get('/', fn() => Inertia::render('Public/Home'))->name('home');

// Public browse
Route::get('products/{product}', [ProductController::class, 'show'])->name('products.show');
Route::get('vets', [VetProfileController::class, 'index'])->name('vets.index');
Route::get('vets/{vet}', [VetProfileController::class, 'show'])->name('vets.show');
Route::get('adoptions', [AdoptionListingController::class, 'index'])->name('adoptions.index');
Route::get('adoptions/{adoption}', [AdoptionListingController::class, 'show'])->name('adoptions.show');

require __DIR__ . '/auth.php';
require __DIR__ . '/settings.php';

/*
|--------------------------------------------------------------------------
| Authenticated routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth'])->group(function () {
    Route::middleware(['redirect.role'])->get('/dashboard', fn() => null)->name('dashboard');

    // Profile
    Route::get('/profile', [ProfileController::class, 'show'])->name('profile.show');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');

    /*
    |--------------------------------------------------------------------------
    | Owner routes
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:owner')->prefix('owner')->name('owner.')->group(function () {
        Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

        Route::resource('pets', PetController::class);

        Route::get('pets/{pet}/health', [HealthRecordController::class, 'indexForPet'])
            ->name('pets.health.index');

        Route::post('appointments/{pet}', [AppointmentController::class, 'bookForPet'])
            ->name('appointments.book');

        // Optional: enable orders
        Route::resource('orders', OrderController::class)->only(['index', 'show', 'store', 'create']);
    });

    /*
    |--------------------------------------------------------------------------
    | Vet routes
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:vet')->prefix('vet')->name('vet.')->group(function () {
        Route::get('appointments', [AppointmentController::class, 'vetIndex'])->name('appointments.index');
        Route::patch('appointments/{appointment}/approve', [AppointmentController::class, 'approve'])->name('appointments.approve');
        Route::patch('appointments/{appointment}/reschedule', [AppointmentController::class, 'reschedule'])->name('appointments.reschedule');
        Route::patch('appointments/{appointment}/cancel', [AppointmentController::class, 'cancel'])->name('appointments.cancel');

        Route::resource('health-records', HealthRecordController::class)->only(['store', 'update', 'destroy']);
        Route::resource('vet-profile', VetProfileController::class)->only(['show', 'update']);
    });

    /*
    |--------------------------------------------------------------------------
    | Shelter routes
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:shelter')->prefix('shelter')->name('shelter.')->group(function () {
        Route::resource('adoptions', AdoptionListingController::class);
        Route::resource('shelter-profile', ShelterProfileController::class)->only(['show', 'update']);
        Route::resource('products', ProductController::class);
    });

    /*
    |--------------------------------------------------------------------------
    | Shared auth routes
    |--------------------------------------------------------------------------
    */
    Route::post('products/{product}/reviews', [ProductController::class, 'review'])->name('products.review');
    Route::post('adoptions/{adoption}/interest', [AdoptionListingController::class, 'expressInterest'])->name('adoptions.interest');
});

/*
|--------------------------------------------------------------------------
| Admin routes
|--------------------------------------------------------------------------
// */
// Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
//     Route::get('dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
//     Route::resource('users', UserManagementController::class)->only(['index', 'edit', 'update', 'destroy']);
// });

/*
|--------------------------------------------------------------------------
| Health & fallback
|--------------------------------------------------------------------------
*/
Route::get('/health', fn() => response()->json(['status' => 'ok']));

// Route::fallback(fn() => Inertia::render('Errors/NotFound')->toResponse(request())->setStatusCode(404));
