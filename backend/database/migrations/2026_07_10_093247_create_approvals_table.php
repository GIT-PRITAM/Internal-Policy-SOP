<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('approvals', function (Blueprint $table) {
            $table->id();

            $table->foreignId('policy_document_id')->constrained('policy_documents')->cascadeOnDelete();
            $table->foreignId('policy_version_id')->constrained('policy_versions')->cascadeOnDelete();

            $table->foreignId('approver_user_id')->constrained('users')->cascadeOnDelete();

            $table->string('status'); // Pending, Approved, Rejected
            $table->text('comments')->nullable();
            $table->timestamp('action_at')->nullable();

            $table->timestamps();

            $table->index(['policy_document_id', 'status']);
            $table->index(['policy_version_id']);
            $table->index(['approver_user_id']);
            $table->index(['action_at']);
        });

    }

    public function down(): void
    {
        Schema::dropIfExists('approvals');
    }
};

