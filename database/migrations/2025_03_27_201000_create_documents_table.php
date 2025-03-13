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
        Schema::create('documents', function (Blueprint $table) {
            $table->id('documentID');
            $table->foreignId('documentRequestID');
            $table->string('fileName');
            $table->string('filePath');
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('documentRequestID')
                ->references('documentRequestID')
                ->on('document_requests');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
