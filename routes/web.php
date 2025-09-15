<?php

use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\UserManagementController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Owner\DashboardController;
use App\Http\Controllers\HealthRecordController;
use App\Http\Controllers\Owner\AppointmentBrowseController;
use App\Http\Controllers\Vet\VeterinarianController as VetController;
use App\Http\Controllers\Owner\AppointmentController;
use App\Http\Controllers\Owner\OrderController;
use App\Http\Controllers\Owner\OwnerTransactionController;
use App\Http\Controllers\Owner\PetController;
use App\Http\Controllers\Owner\RequestController;
use App\Http\Controllers\Public\ProductController as PublicProductController;
use App\Http\Controllers\Shelter\AdoptionListingController;
use App\Http\Controllers\Shelter\ProductController as ShelterProductController;
use App\Http\Controllers\Shelter\ShelterProfileController;
use App\Http\Controllers\ShelterController;
use App\Http\Controllers\Vet\VetProfileController;

/*
|--------------------------------------------------------------------------
| Public routes
|--------------------------------------------------------------------------
*/

require __DIR__ . '/auth.php';
require __DIR__ . '/settings.php';

// Public browse
Route::get('/', fn() => Inertia::render('Public/Home'))->name('home');
Route::get('/petcare-tips', fn() => Inertia::render('Public/PetCare'))->name('petCare');
Route::get('/about', fn() => Inertia::render('Public/About'))->name('about');
Route::get('/contact', fn() => Inertia::render('Public/Contact'))->name('contact');

Route::get('products', [PublicProductController::class, 'index'])->name('products.index');
Route::get('products/{product}', [PublicProductController::class, 'show'])->name('products.show');

Route::get('vets', [VetProfileController::class, 'index'])->name('vets.index');
Route::get('vets/{vet}', [VetProfileController::class, 'show'])->name('vets.show');
Route::get('adoptions', [AdoptionListingController::class, 'index'])->name('adoptions.index');
Route::get('adoptions/{adoption}', [AdoptionListingController::class, 'show'])->name('adoptions.show');
Route::get('vets', [AppointmentBrowseController::class, 'index'])
  ->name('vets.index');

Route::get('vets/{vet}', [AppointmentBrowseController::class, 'show'])
  ->name('vets.show');


/*
|--------------------------------------------------------------------------
| Authenticated routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth'])->group(function () {
  Route::middleware(['redirect.role'])->get('/dashboard', fn() => null)->name('dashboard');


  //   Route::get('appointments', [VetController::class, 'appointments'])->name('appointments.index');
  // Route::get('appointments/{appointment}', [VetController::class, 'showAppointment'])->name('appointments.show');


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

    Route::get('pets/{pet}/health/{healthRecord}', [HealthRecordController::class, 'show'])
      ->name('pets.health.show');

    Route::patch('pets/{pet}/health/{healthRecord}', [HealthRecordController::class, 'update'])
      ->name('pets.health.update');

    Route::delete('pets/{pet}/health/{healthRecord}', [HealthRecordController::class, 'destroy'])->name('pets.health.destroy');

    Route::patch('pets/{pet}/reminders', [PetController::class, 'updateReminders'])
      ->name('pets.updateReminders');

    Route::get('/appointments', [AppointmentController::class, 'index'])
      ->name('appointments.index');

    Route::get('appointments/{appointment}', [AppointmentController::class, 'show'])
      ->name('appointments.show');

    Route::patch('appointments/{appointment}/cancel', [AppointmentController::class, 'cancel'])
      ->name('appointments.cancel');

    Route::get('pets/{pet}/appointments/create', [AppointmentController::class, 'create'])
      ->name('appointments.create');

    Route::post('pets/{pet}/appointments', [AppointmentController::class, 'store'])
      ->name('appointments.store');

    Route::post('/transactions/store', [OwnerTransactionController::class, 'store'])->name('transaction.store');


    Route::get('/orders', [OrderController::class, 'index'])->name('orders');
  });

  /*
    |--------------------------------------------------------------------------
    | Vet routes
    |--------------------------------------------------------------------------
    */
  Route::middleware('role:vet')->prefix('vet')->name('vet.')->group(function () {
    Route::get('dashboard', [VetController::class, 'dashboard'])->name('dashboard');


    Route::get('/appointments', [AppointmentController::class, 'index'])
      ->name('appointments.index');

    Route::get('appointments/{appointment}', [AppointmentController::class, 'show'])
      ->name('appointments.show');

    Route::patch('appointments/{appointment}/approve', [VetController::class, 'approveAppointment'])->name('appointments.approve');
    Route::patch('appointments/{appointment}/reschedule', [VetController::class, 'rescheduleAppointment'])->name('appointments.reschedule');
    Route::patch('appointments/{appointment}/cancel', [VetController::class, 'cancelAppointment'])->name('appointments.cancel');
    Route::patch('appointments/{appointment}/complete', [VetController::class, 'completeAppointment'])->name('appointments.complete');


    Route::patch('appointments/{appointment}/approve', [VetController::class, 'approveAppointment'])->name('appointments.approve');
    Route::patch('appointments/{appointment}/reschedule', [VetController::class, 'rescheduleAppointment'])->name('appointments.reschedule');
    Route::patch('appointments/{appointment}/cancel', [VetController::class, 'cancelAppointment'])->name('appointments.cancel');
    Route::patch('appointments/{appointment}/complete', [VetController::class, 'completeAppointment'])->name('appointments.complete');

    Route::get('profile/create', [VetProfileController::class, 'create'])->name('profile.create');
    Route::post('profile', [VetProfileController::class, 'store'])->name('profile.store');
    Route::get('profile/edit', [VetProfileController::class, 'edit'])->name('profile.edit');
    Route::put('profile', [VetProfileController::class, 'update'])->name('profile.update');

    Route::get('schedule', [VetController::class, 'availabilityIndex'])
      ->name('schedule.index');

    Route::post('schedule', [VetController::class, 'saveAvailability'])
      ->name('vet.schedule.save');

    Route::get('schedule', [VetController::class, 'availabilityIndex'])->name('schedule.index');
    Route::post('schedule/save', [VetController::class, 'saveAvailability'])->name('schedule.save');
    Route::post('schedule/add', [VetController::class, 'addAvailabilitySlot'])->name('schedule.add');
    Route::delete('schedule/remove/{slotId}', [VetController::class, 'removeAvailabilitySlot'])->name('schedule.remove');
  });



  /*
    |--------------------------------------------------------------------------
    | Shelter routes
    |--------------------------------------------------------------------------
    */

  /// fix edit things adoption and products
  Route::middleware('role:shelter')->prefix('shelter')->name('shelter.')->group(function () {
    Route::get('dashboard', [\App\Http\Controllers\Shelter\DashboardController::class, 'index'])
      ->name('dashboard');

    Route::resource('adoptions', AdoptionListingController::class)->except('index');
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
