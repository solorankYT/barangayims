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
        Schema::create('certificates', function (Blueprint $table) {
            $table->id('certificateID');
            $table->foreignId('certificateRequestID');
            $table->string('fileName');
            $table->string('filePath');
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('certificateRequestID')
                ->references('certificateRequestID')
                ->on('certificate_requests');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('certificates');
    }
};
