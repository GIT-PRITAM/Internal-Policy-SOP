<?php

namespace App\Services;

use App\Models\Notification;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\LengthAwarePaginator;

class NotificationService
{
    private function baseForUser(int $userId): Builder
    {
        return Notification::query()->where('user_id', $userId);
    }

    public function listForUser(int $userId, int $perPage, ?string $status): LengthAwarePaginator
    {
        $q = $this->baseForUser($userId);

        if ($status && $status !== 'all') {
            if ($status === 'unread') {
                $q->where('is_read', false);
            }

            if ($status === 'read') {
                $q->where('is_read', true);
            }
        }

        return $q->orderByDesc('created_at')->paginate(perPage: $perPage);
    }

    public function markOneAsRead(int $userId, int $notificationId): void
    {
        Notification::query()
            ->where('user_id', $userId)
            ->where('id', $notificationId)
            ->update([
                'is_read' => true,
                'read_at' => now(),
            ]);
    }

    public function markAllAsRead(int $userId): void
    {
        Notification::query()
            ->where('user_id', $userId)
            ->where('is_read', false)
            ->update([
                'is_read' => true,
                'read_at' => now(),
            ]);
    }

    public function unreadCount(int $userId): int
    {
        return Notification::query()
            ->where('user_id', $userId)
            ->where('is_read', false)
            ->count();
    }
}

