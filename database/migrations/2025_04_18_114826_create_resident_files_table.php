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
        Schema::create('resident_files', function (Blueprint $table) {
            $table->id();
            $table->foreignId('resident_id');
            $table->string('fileName');
            $table->string('filePath');
            $table->timestamps();

            $table->foreign('resident_id')
                ->references('id')
                ->on('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('resident_files');
    }
};
