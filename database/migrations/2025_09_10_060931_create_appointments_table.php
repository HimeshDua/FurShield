<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAppointmentsTable extends Migration
{
    public function up()
    {
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pet_id')->constrained('pets')->cascadeOnDelete();
            $table->foreignId('owner_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('vet_id')->constrained('users')->cascadeOnDelete();
            $table->dateTime('appointment_time');
            $table->enum('status', ['pending', 'approved', 'rescheduled', 'cancelled', 'completed'])->default('pending');
            $table->text('reason')->nullable();
            $table->text('notes')->nullable(); // vet's notes or owner notes
            $table->integer('duration_minutes')->default(30);
            $table->timestamps();
            $table->index(['vet_id', 'appointment_time']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('appointments');
    }
}
