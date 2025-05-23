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
        Schema::create('document_requests', function (Blueprint $table) {
            $table->id('documentRequestID');
            $table->foreignId('userID');
            $table->foreignId('documentTypeID');
            $table->string('status');
            $table->string('pickupOption')->nullable();
            $table->string('purpose');
            $table->string('remarks');
            $table->timestamps();
            $table->softDeletes();
            
            $table->foreign('userID')
                ->references('id')
                ->on('users');

            $table->foreign('documentTypeID')
                ->references('documentTypeID')
                ->on('document_types');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('document_requests');
    }
};
