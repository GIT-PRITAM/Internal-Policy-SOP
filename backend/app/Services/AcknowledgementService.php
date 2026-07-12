<?php

namespace App\Services;

use App\Models\Acknowledgement;
use App\Models\PolicyDocument;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\LengthAwarePaginator;

class AcknowledgementService
{
    private function employeePolicyScopeQuery(Builder $query, User $user): Builder
    {
        // Must match PolicyDocumentPolicy visibility + approved constraint.
        $query->where('status', 'Approved');

        return $query->where(function (Builder $visibilityQuery) use ($user) {
            $visibilityQuery
                ->where('visibility', 'Public')
                ->orWhere(function (Builder $qq) use ($user) {
                    $qq->where('visibility', 'Department')
                        ->where('department_id', $user->department_id);
                })
                ->orWhere(function (Builder $qq) use ($user) {
                    $qq->where('visibility', 'Private')
                        ->where('owner_user_id', $user->id);
                });
        });
    }

    private function isAdmin(User $user): bool
    {
        return (string) $user->role?->name === 'Admin';
    }

    public function acknowledge(int $userId, int $policyId): Acknowledgement
    {
        $user = User::query()->findOrFail($userId);

        $policy = PolicyDocument::query()
            ->findOrFail($policyId);

        // Reuse visibility rules: employees can acknowledge only within their scope.
        if (!$this->isAdmin($user)) {
            // Must be Approved and visible to the user.
            $this->employeePolicyScopeQuery(PolicyDocument::query(), $user)
                ->where('id', $policyId)
                ->exists();

            $visible = $this->employeePolicyScopeQuery(PolicyDocument::query(), $user)
                ->where('id', $policyId)
                ->exists();

            abort_unless($visible, 403);
        }

        // Enforce uniqueness (prevents duplicate acknowledgement via unique index).
        $existing = Acknowledgement::query()
            ->where('user_id', $userId)
            ->where('policy_document_id', $policyId)
            ->first();

        if ($existing) {
            // If already acknowledged, return existing record (idempotent).
            return $existing;
        }

        return Acknowledgement::query()->create([
            'user_id' => $userId,
            'policy_document_id' => $policyId,
            'status' => 'Acknowledged',
            'acknowledged_at' => now(),
        ]);
    }

    public function pending(int $userId, int $perPage, ?string $search): LengthAwarePaginator
    {
        $user = User::query()->findOrFail($userId);

        $ackSubquery = Acknowledgement::query()
            ->select('policy_document_id')
            ->where('user_id', $userId)
            ->where('status', 'Acknowledged');

        $query = PolicyDocument::query();

        if ($this->isAdmin($user)) {
            $query->whereNotIn('id', $ackSubquery);
        } else {
            $this->employeePolicyScopeQuery($query, $user);
            $query->whereNotIn('id', $ackSubquery);
        }

        if ($search) {
            $query->where(function (Builder $q) use ($search) {
                $needle = '%' . mb_strtolower($search) . '%';
                $q->whereRaw('LOWER(title) LIKE ?', [$needle])
                    ->orWhereRaw('LOWER(COALESCE(summary, \'\')) LIKE ?', [$needle]);
            });
        }

        return $query->orderByDesc('updated_at')->paginate(perPage: $perPage);
    }

    public function completed(int $userId, int $perPage, ?string $search): LengthAwarePaginator
    {
        $user = User::query()->findOrFail($userId);

        $ackSubquery = Acknowledgement::query()
            ->select('policy_document_id')
            ->where('user_id', $userId)
            ->where('status', 'Acknowledged');

        $query = PolicyDocument::query()->whereIn('id', $ackSubquery);

        if (!$this->isAdmin($user)) {
            $this->employeePolicyScopeQuery($query, $user);
        }

        if ($search) {
            $query->where(function (Builder $q) use ($search) {
                $needle = '%' . mb_strtolower($search) . '%';
                $q->whereRaw('LOWER(title) LIKE ?', [$needle])
                    ->orWhereRaw('LOWER(COALESCE(summary, \'\')) LIKE ?', [$needle]);
            });
        }

        return $query->orderByDesc('updated_at')->paginate(perPage: $perPage);
    }
}

