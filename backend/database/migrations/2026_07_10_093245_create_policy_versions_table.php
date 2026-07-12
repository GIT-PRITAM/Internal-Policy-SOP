<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('policy_versions', function (Blueprint $table) {
            $table->id();

            $table->foreignId('policy_document_id')->constrained('policy_documents')->cascadeOnDelete();

            $table->unsignedInteger('version_number');
            $table->string('title')->nullable();
            $table->longText('content');
            $table->text('change_summary')->nullable();

            $table->foreignId('created_by')->constrained('users')->cascadeOnDelete();
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();

            $table->timestamp('approved_at')->nullable();


            $table->timestamps();

            $table->unique(['policy_document_id', 'version_number']);
            $table->index(['policy_document_id', 'version_number']);
            $table->index(['created_by']);
            $table->index(['approved_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('policy_versions');
    }
};

