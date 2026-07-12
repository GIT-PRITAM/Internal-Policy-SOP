<?php

namespace App\Services;

use App\Models\Bookmark;
use App\Models\PolicyDocument;
use App\Repositories\BookmarkRepository;
use App\Repositories\PolicyDocumentRepository;
use Illuminate\Pagination\LengthAwarePaginator;

class BookmarkService
{
    public function __construct(
        private readonly BookmarkRepository $bookmarkRepository,
        private readonly PolicyDocumentRepository $policyDocumentRepository
    ) {
    }

    public function add(int $userId, int $policyId): Bookmark
    {
        return $this->bookmarkRepository->createIfNotExists(userId: $userId, policyId: $policyId);
    }

    public function remove(int $userId, int $policyId): void
    {
        $this->bookmarkRepository->deleteByUserAndPolicy(userId: $userId, policyId: $policyId);
    }

    public function listMy(
        int $userId,
        int $perPage,
        ?string $search,
        ?string $visibility,
        ?int $departmentId
    ): LengthAwarePaginator {
        return $this->policyDocumentRepository->listBookmarksForUser(
            userId: $userId,
            perPage: $perPage,
            search: $search,
            visibility: $visibility,
            departmentId: $departmentId
        );
    }
}

