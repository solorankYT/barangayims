<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('weather_data', function (Blueprint $table) {
            $table->id();
            $table->string('city');
            $table->string('country');
            $table->string('region');
            $table->decimal('latitude', 8, 5);
            $table->decimal('longitude', 8, 5);
            $table->string('timezone');
            $table->dateTime('localtime');
            $table->integer('temperature');
            $table->integer('weather_code');
            $table->string('weather_description');
            $table->string('weather_icon');
            $table->integer('wind_speed');
            $table->integer('wind_degree');
            $table->string('wind_dir');
            $table->integer('pressure');
            $table->decimal('precip', 5, 2);
            $table->integer('humidity');
            $table->integer('cloudcover');
            $table->integer('feels_like');
            $table->integer('uv_index');
            $table->integer('visibility');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('weather_data');
    }
};
