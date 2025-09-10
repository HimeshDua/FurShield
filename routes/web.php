<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PetController;
use App\Http\Controllers\HealthRecordController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\AdoptionListingController;
use App\Http\Controllers\VetProfileController;
use App\Http\Controllers\ShelterProfileController;
use Inertia\Inertia;


Route::get('/', function () {
    return Inertia::render('Public/Home');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';

Route::middleware(['auth'])->group(function () {

    // Owner-only: manage pets, orders, bookings
    Route::middleware('role:owner')->group(function () {
        Route::resource('pets', PetController::class);
        Route::get('pets/{pet}/health', [HealthRecordController::class, 'indexForPet'])->name('pets.health.index');
        Route::post('appointments/{pet}', [AppointmentController::class, 'bookForPet'])->name('appointments.book');
        Route::resource('orders', OrderController::class)->only(['index', 'show', 'store']);
    });

    // Vet-only: manage own appointments & health records
    Route::middleware('role:vet')->group(function () {
        Route::get('vet/appointments', [AppointmentController::class, 'vetIndex'])->name('vet.appointments.index');
        Route::patch('appointments/{appointment}/approve', [AppointmentController::class, 'approve'])->name('appointments.approve');
        Route::resource('health-records', HealthRecordController::class)->only(['store', 'update', 'destroy']);
        Route::resource('vet-profile', VetProfileController::class)->only(['show', 'update']);
    });

    // Shelter-only
    Route::middleware('role:shelter')->group(function () {
        Route::resource('adoptions', AdoptionListingController::class);
        Route::resource('shelter-profile', ShelterProfileController::class)->only(['show', 'update']);
    });

    // Common read routes (products, vets list, adoption listings, reviews)
    Route::get('products', [ProductController::class, 'index'])->name('products.index');
    Route::get('products/{product}', [ProductController::class, 'show'])->name('products.show');
    Route::post('products/{product}/reviews', [ProductController::class, 'review'])->name('products.review')->middleware('auth');

    Route::get('vets', [VetProfileController::class, 'index'])->name('vets.index');
    Route::get('vets/{vet}', [VetProfileController::class, 'show'])->name('vets.show');

    Route::get('adoptions', [AdoptionListingController::class, 'index'])->name('adoptions.index');
});
