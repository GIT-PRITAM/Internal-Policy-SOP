<?php

namespace App\Http\Controllers;

use App\Http\Requests\MarkNotificationReadRequest;
use App\Http\Requests\NotificationsListRequest;
use App\Http\Resources\NotificationResource;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;

class NotificationController extends Controller
{
    public function __construct(
        private readonly NotificationService $service
    ) {
    }

    public function list(NotificationsListRequest $request): JsonResponse
    {
        $result = $this->service->listForUser(
            userId: $request->user()->id,
            perPage: $request->integer('per_page', 10),
            status: $request->string('status', 'all')
        );

        return response()->json([
            'status' => 'success',
            'data' => NotificationResource::collection($result),
            'meta' => [
                'total' => $result->total(),
                'per_page' => $result->perPage(),
                'current_page' => $result->currentPage(),
                'last_page' => $result->lastPage(),
            ],
        ]);
    }

    public function markAsRead(MarkNotificationReadRequest $request, int $id): JsonResponse
    {
        $this->service->markOneAsRead(userId: $request->user()->id, notificationId: $id);

        return response()->json([
            'status' => 'success',
            'message' => 'Notification marked as read',
        ]);
    }

    public function markAllAsRead(MarkNotificationReadRequest $request): JsonResponse
    {
        $this->service->markAllAsRead(userId: $request->user()->id);

        return response()->json([
            'status' => 'success',
            'message' => 'All notifications marked as read',
        ]);
    }

    public function unreadCount(NotificationsListRequest $request): JsonResponse
    {
        $count = $this->service->unreadCount(userId: $request->user()->id);

        return response()->json([
            'status' => 'success',
            'data' => ['unread_count' => $count],
        ]);
    }
}

