<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Approval extends Model
{
    protected $fillable = [
        'policy_document_id',
        'policy_version_id',
        'approver_user_id',
        'status',
        'comments',
        'action_at',
    ];

    protected function casts(): array
    {
        return [
            'action_at' => 'datetime',
        ];
    }

    public function policyDocument(): BelongsTo
    {
        return $this->belongsTo(PolicyDocument::class, 'policy_document_id');
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approver_user_id');
    }

    public function policyVersion(): BelongsTo
    {
        return $this->belongsTo(PolicyVersion::class, 'policy_version_id');
    }
}

