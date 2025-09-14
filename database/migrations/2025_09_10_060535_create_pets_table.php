<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePetsTable extends Migration
{
    public function up()
    {
        Schema::create('pets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('owner_id')->constrained('users')->cascadeOnDelete();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('species'); // dog, cat, etc.
            $table->string('breed')->nullable();
            $table->date('birth_date')->nullable();
            $table->enum('gender', ['male', 'female', 'unknown'])->default('unknown');
            $table->decimal('weight_kg', 5, 2)->nullable();
            $table->string('microchip')->nullable();
            $table->text('notes')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('pets');
    }
}
