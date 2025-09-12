<?php

use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\UserManagementController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Owner\DashboardController;
use App\Http\Controllers\HealthRecordController;
use App\Http\Controllers\Owner\AppointmentController;
use App\Http\Controllers\Owner\OrderController;
use App\Http\Controllers\Owner\PetController;
use App\Http\Controllers\Public\ProductController as PublicProductController;
use App\Http\Controllers\Shelter\AdoptionListingController;
use App\Http\Controllers\Shelter\ProductController as ShelterProductController;
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
Route::get('products', [PublicProductController::class, 'index'])->name('products.index');
Route::get('products/{product}', [PublicProductController::class, 'show'])->name('products.show');
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

        Route::get('pets/{pet}/health/create', [HealthRecordController::class, 'create'])
            ->name('pets.health.create');

        Route::post('pets/{pet}/health', [HealthRecordController::class, 'store'])
            ->name('pets.health.store');

        Route::get('pets/{pet}/health/{healthRecord}/edit', [HealthRecordController::class, 'edit'])
            ->name('pets.health.edit');

        Route::get('pets/{pet}/health/{healthRecord}/edit', [HealthRecordController::class, 'edit'])
            ->name('pets.health.show');

        Route::patch('pets/{pet}/health/{healthRecord}', [HealthRecordController::class, 'update'])
            ->name('pets.health.update');

        Route::delete('pets/{pet}/health/{healthRecord}', [HealthRecordController::class, 'destroy'])
            ->name('pets.health.destroy');

        Route::post('appointments/{pet}', [AppointmentController::class, 'bookForPet'])->name('appointments.book');

        // Optional: enable orders
        Route::get('/orders', [OrderController::class, 'index'])->name('orders');
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

    /// fix edit things adoption and products
    Route::middleware('role:shelter')->prefix('shelter')->name('shelter.')->group(function () {
        Route::resource('adoptions', AdoptionListingController::class);
        // ->only(['create', 'store', 'update', 'destroy']);
        // Route::resource('shelter-profile', ShelterProfileController::class)->only(['show', 'update']);
        Route::resource('products', ShelterProductController::class);
    });

    /*
    |--------------------------------------------------------------------------
    | Shared auth routes
    |--------------------------------------------------------------------------
    */
    Route::post('products/{product}/reviews', [ShelterProductController::class, 'review'])->name('products.review');
    Route::post('adoptions/{adoption}/interest', [AdoptionListingController::class, 'expressInterest'])->name('adoptions.interest');
});

/*
|--------------------------------------------------------------------------
| Admin routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
    Route::get('', [AdminDashboardController::class, 'index'])->name('dashboard');
    Route::resource('users', UserManagementController::class)->only(['index', 'edit', 'update', 'destroy']);
});

/*
|--------------------------------------------------------------------------
| Health & fallback
|--------------------------------------------------------------------------
*/
Route::get('/health', fn() => response()->json(['status' => 'ok']));

// Route::fallback(fn() => Inertia::render('Errors/NotFound')->toResponse(request())->setStatusCode(404));
