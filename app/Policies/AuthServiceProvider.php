<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use App\Models\Pet;
use App\Models\HealthRecord;
use App\Models\Appointment;
use App\Models\Product;
use App\Models\Order;
use App\Models\AdoptionListing;
use App\Models\VetProfile;
use App\Models\ShelterProfile;
use App\Policies\PetPolicy;
use App\Policies\HealthRecordPolicy;
use App\Policies\AppointmentPolicy;
use App\Policies\ProductPolicy;
use App\Policies\OrderPolicy;
use App\Policies\AdoptionListingPolicy;
use App\Policies\VetProfilePolicy;
use App\Policies\ShelterProfilePolicy;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        Pet::class => PetPolicy::class,
        HealthRecord::class => HealthRecordPolicy::class,
        Appointment::class => AppointmentPolicy::class,
        Product::class => ProductPolicy::class,
        Order::class => OrderPolicy::class,
        AdoptionListing::class => AdoptionListingPolicy::class,
        VetProfile::class => VetProfilePolicy::class,
        ShelterProfile::class => ShelterProfilePolicy::class,
    ];

    public function boot()
    {
        $this->registerPolicies();
    }
}
