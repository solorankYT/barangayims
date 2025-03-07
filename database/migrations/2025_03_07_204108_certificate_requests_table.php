><?php

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
        Schema::create('certificate_requests', function (Blueprint $table) {
            $table->id('certificateRequestID');
            $table->foreignId('userID');
            $table->string('certificateType');
            $table->string('status');
            $table->string('purpose');
            $table->string('remarks');
            $table->foreignId('certificateID')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->foreign('userID')
                ->references('id')
                ->on('users');

            $table->foreign('certificateID')
                ->references('certificateID')
                ->on('certificates');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('certificate_requests');
    }
};
