<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('pets', function (Blueprint $table) {
            if (!Schema::hasColumn('pets', 'next_vaccination_at')) {
                $table->dateTime('next_vaccination_at')->nullable()->after('microchip');
            }
            $table->dateTime('next_food_at')->nullable()->after('next_vaccination_at');
        });
    }

    public function down(): void
    {
        Schema::table('pets', function (Blueprint $table) {
            $table->dropColumn(['next_vaccination_at', 'next_food_at']);
        });
    }
};
