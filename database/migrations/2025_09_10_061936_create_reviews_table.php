<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateReviewsTable extends Migration
{
    public function up()
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete(); // reviewer
            $table->morphs('reviewable'); // reviewable_type, reviewable_id (vets, shelters, products)
            $table->tinyInteger('rating')->unsigned()->default(5);
            $table->text('comment')->nullable();
            $table->timestamps();
            $table->unique(['user_id', 'reviewable_type', 'reviewable_id']); // one review per user per item
        });
    }

    public function down()
    {
        Schema::dropIfExists('reviews');
    }
}
