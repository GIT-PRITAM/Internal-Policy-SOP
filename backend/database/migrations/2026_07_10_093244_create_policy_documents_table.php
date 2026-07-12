<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('policy_documents', function (Blueprint $table) {
            $table->id();

            $table->foreignId('department_id')->constrained()->cascadeOnDelete();
            $table->foreignId('owner_user_id')->constrained('users')->cascadeOnDelete();

            $table->string('title');
            $table->string('summary')->nullable();
            $table->longText('content');

            $table->string('visibility'); // Public, Department, Private
            $table->string('status'); // Draft, Under Review, Approved, Archived

            $table->boolean('mandatory')->default(false);

            $table->date('effective_date')->nullable();
            $table->date('review_date')->nullable();

            $table->foreignId('current_version_id')->nullable();

            $table->timestamps();

            $table->index(['department_id', 'status']);

            $table->index(['owner_user_id']);
            $table->index(['visibility']);
            $table->index(['mandatory']);
            $table->index(['effective_date']);
            $table->index(['review_date']);
            $table->index(['title']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('policy_documents');
    }
};

