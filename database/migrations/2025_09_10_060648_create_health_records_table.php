<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateHealthRecordsTable extends Migration
{
  public function up()
  {
    Schema::create('health_records', function (Blueprint $table) {
      $table->id();
      $table->foreignId('pet_id')->constrained('pets')->cascadeOnDelete();
      $table->foreignId('vet_id')->nullable()->constrained('users')->nullOnDelete();
      $table->date('visit_date')->nullable();
      $table->string('title')->nullable();
      $table->text('diagnosis')->nullable();
      $table->text('treatment')->nullable();
      $table->json('attachments')->nullable();
      $table->timestamps();
    });
  }

  public function down()
  {
    Schema::dropIfExists('health_records');
  }
}
