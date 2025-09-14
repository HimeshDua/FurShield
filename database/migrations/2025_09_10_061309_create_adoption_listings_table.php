<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAdoptionListingsTable extends Migration
{
    public function up()
    {
        Schema::create('adoption_listings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('shelter_id')->constrained('users')->cascadeOnDelete();
            $table->string('pet_name');
            $table->string('species');
            $table->string('breed')->nullable();
            $table->string('age')->nullable();
            $table->enum('status', ['available', 'pending', 'adopted'])->default('available');
            $table->text('description')->nullable();
            $table->json('images')->nullable(); // quick array of paths for hackathon
            $table->timestamps();
            $table->index(['shelter_id', 'status']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('adoption_listings');
    }
}
