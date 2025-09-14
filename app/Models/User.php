<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Date;

class User extends Authenticatable
{
    use  HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'phone',
        'address',
        'avatar',
        'lastOnline',
        'bio'
    ];

    protected $hidden = ['password', 'remember_token'];

    protected $casts = ['email_verified_at' => 'datetime'];

    // helpers
    public function lastOnline()
    {
        return $this->lastOnline;
    }

    public function isVet()
    {
        return $this->role === 'vet';
    }
    public function isOwner()
    {
        return $this->role === 'owner';
    }
    public function isShelter()
    {
        return $this->role === 'shelter';
    }

    // relationships
    public function pets()
    {
        return $this->hasMany(Pet::class, 'owner_id');
    }

    public function products()
    {
        return $this->hasMany(Product::class, 'owner_id');
    }

    public function vetProfile()
    {
        return $this->hasOne(VetProfile::class);
    }

    public function shelterProfile()
    {
        return $this->hasOne(ShelterProfile::class);
    }

    public function appointmentsAsVet()
    {
        return $this->hasMany(Appointment::class, 'vet_id');
    }

    public function appointmentsAsOwner()
    {
        return $this->hasMany(Appointment::class, 'owner_id');
    }

    public function orders()
    {
        return $this->hasMany(Order::class, 'owner_id');
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
}
