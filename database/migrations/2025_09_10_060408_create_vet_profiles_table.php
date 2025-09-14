<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateVetProfilesTable extends Migration
{
    public function up()
    {
        Schema::create('vet_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->json('specializations')->nullable(); // e.g. ["canine","feline"]
            $table->text('qualifications')->nullable();
            $table->json('availability')->nullable(); // free-form JSON for hackathon
            $table->decimal('consultation_fee', 8, 2)->nullable();
            $table->string('clinic_address')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('vet_profiles');
    }
}
