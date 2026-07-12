<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PolicyDocument extends Model
{
    protected $fillable = [
        'department_id',
        'owner_user_id',
        'title',
        'summary',
        'content',
        'visibility',
        'status',
        'mandatory',
        'effective_date',
        'review_date',
        'current_version_id',
    ];

    protected function casts(): array
    {
        return [
            'mandatory' => 'boolean',
            'effective_date' => 'date',
            'review_date' => 'date',
        ];
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_user_id');
    }

    public function versions()
    {
        return $this->hasMany(PolicyVersion::class, 'policy_document_id');
    }

    public function currentVersion()
    {
        return $this->belongsTo(PolicyVersion::class, 'current_version_id');
    }

    public function bookmarks()
    {
        return $this->hasMany(Bookmark::class, 'policy_document_id');
    }

    public function acknowledgements()
    {
        return $this->hasMany(Acknowledgement::class, 'policy_document_id');
    }

    public function approvals()
    {
        return $this->hasMany(Approval::class, 'policy_document_id');
    }
}
