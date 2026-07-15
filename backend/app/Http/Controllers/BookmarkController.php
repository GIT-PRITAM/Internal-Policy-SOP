<?php

namespace App\Http\Controllers;

use App\Http\Requests\AddBookmarkRequest;
use App\Http\Requests\ListBookmarksRequest;
use App\Http\Resources\PolicyDocumentResource;
use App\Services\BookmarkService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BookmarkController extends Controller
{
    public function __construct(
        private readonly BookmarkService $service
    ) {
    }

    /**
     * Add a bookmark for the authenticated user.
     */
    public function add(AddBookmarkRequest $request): JsonResponse
    {
        $bookmark = $this->service->add(
            userId: $request->user()->id,
            policyId: $request->integer('policy_id')
        );

        return response()->json([
            'status' => 'success',
            'data' => [
                'bookmark_id' => $bookmark->id,
                'policy_id' => $bookmark->policy_document_id,
                'bookmarked_at' => optional($bookmark->created_at)->toISOString(),
            ],
        ], 201);
    }

    /**
     * Remove a bookmark.
     */
    public function remove(Request $request): JsonResponse
    {
        $this->service->remove(
            userId: $request->user()->id,
            policyId: (int) $request->route('policy_id')
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Bookmark removed',
        ]);
    }

    /**
     * List my bookmarks with pagination, search and filtering.
     */
    public function listMy(ListBookmarksRequest $request): JsonResponse
    {
        $result = $this->service->listMy(
            userId: $request->user()->id,
            perPage: $request->integer('per_page', 10),
            search: $request->string('search', null),
            visibility: $request->string('visibility', null),
            departmentId: $request->integer('department_id', null)
        );

        return response()->json([
            'status' => 'success',
            'data' => PolicyDocumentResource::collection($result),
            'meta' => [
                'total' => $result->total(),
                'per_page' => $result->perPage(),
                'current_page' => $result->currentPage(),
                'last_page' => $result->lastPage(),
            ],
        ]);
    }
}