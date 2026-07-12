<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('acknowledgements', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('policy_document_id')->constrained('policy_documents')->cascadeOnDelete();

            $table->string('status'); // Pending, Acknowledged
            $table->timestamp('acknowledged_at')->nullable();

            $table->timestamps();

            $table->unique(['user_id', 'policy_document_id']);
            $table->index(['user_id', 'status']);

            $table->index(['policy_document_id', 'status']);

            $table->index(['acknowledged_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('acknowledgements');
    }
};

