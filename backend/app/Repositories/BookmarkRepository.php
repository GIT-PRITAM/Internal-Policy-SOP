<?php

namespace App\Repositories;

use App\Models\Bookmark;
use Illuminate\Database\Eloquent\Builder;

class BookmarkRepository
{
    public function createIfNotExists(int $userId, int $policyId): Bookmark
    {
        $bookmark = Bookmark::query()
            ->where('user_id', $userId)
            ->where('policy_document_id', $policyId)
            ->first();

        if ($bookmark) {
            return $bookmark;
        }

        return Bookmark::query()->create([
            'user_id' => $userId,
            'policy_document_id' => $policyId,
        ]);
    }

    public function deleteByUserAndPolicy(int $userId, int $policyId): void
    {
        Bookmark::query()
            ->where('user_id', $userId)
            ->where('policy_document_id', $policyId)
            ->delete();
    }
}

