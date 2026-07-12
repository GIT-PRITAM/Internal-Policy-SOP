<?php

namespace App\Repositories;

use App\Models\PolicyDocument;
use Illuminate\Pagination\LengthAwarePaginator;

class PolicyDocumentRepository
{
    public function listBookmarksForUser(
        int $userId,
        int $perPage,
        ?string $search,
        ?string $visibility,
        ?int $departmentId
    ): LengthAwarePaginator {
        $query = PolicyDocument::query()
            ->whereHas('bookmarks', function ($q) use ($userId) {
                $q->where('user_id', $userId);
            });

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'ilike', "%{$search}%")
                    ->orWhere('summary', 'ilike', "%{$search}%");
            });
        }

        if ($visibility) {
            $query->where('visibility', $visibility);
        }

        if ($departmentId) {
            $query->where('department_id', $departmentId);
        }

        return $query
            ->orderByDesc('created_at')
            ->paginate(perPage: $perPage);
    }
}

