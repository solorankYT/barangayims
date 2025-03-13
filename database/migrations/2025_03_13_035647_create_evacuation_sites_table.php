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
        Schema::create('evacuation_sites', function (Blueprint $table) {
            $table->id();
            $table->string('site_name');
            $table->string('location');
            $table->integer('capacity')->unsigned();
            $table->enum('status', ['Active', 'Full', 'Under Repair'])->default('Active');
            $table->json('resources')->nullable(); 
            $table->string('contact_person');
            $table->string('contact_number', 15);
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->string('link')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('evacuation_sites');
    }
};
