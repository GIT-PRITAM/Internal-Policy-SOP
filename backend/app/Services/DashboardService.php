<?php

namespace App\Services;

use App\Models\Approval;
use App\Models\Acknowledgement;
use App\Models\Bookmark;
use App\Models\Department;
use App\Models\PolicyDocument;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Arr;

class DashboardService
{
    private function isAdmin(User $user): bool
    {
        return (string) $user->role?->name === 'Admin';
    }

    private function employeePolicyScopeQuery(Builder $query, User $user): Builder
    {
        // Must match PolicyDocumentPolicy visibility rules.
        $query->where('status', 'Approved');

        $visibilityQuery = function (Builder $q) use ($user) {
            $q->where('visibility', 'Public')
                ->orWhere(function (Builder $qq) use ($user) {
                    $qq->where('visibility', 'Department')
                        ->where('department_id', $user->department_id);
                })
                ->orWhere(function (Builder $qq) use ($user) {
                    $qq->where('visibility', 'Private')
                        ->where('owner_user_id', $user->id);
                });
        };

        return $query->where($visibilityQuery);
    }

    private function toSeries(array $points): array
    {
        // points: [['label'=>'W1','value'=>12], ...]
        return [
            'labels' => array_map(fn ($p) => (string) $p['label'], $points),
            'datasets' => [
                [
                    'label' => 'Acknowledgements',
                    'data' => array_map(fn ($p) => (int) $p['value'], $points),
                    'borderColor' => '#8b5cf6',
                    'backgroundColor' => 'rgba(139, 92, 246, 0.15)',
                    'tension' => 0.35,
                    'fill' => true,
                ],
            ],
        ];
    }

    public function adminDashboard(int $userId): array
    {
        $user = User::query()->findOrFail($userId);
        abort_unless($this->isAdmin($user), 403);

        $departments = Department::query()->select(['id', 'name'])->orderBy('name')->get();

        $totalPolicies = PolicyDocument::query()->count();

        $policyCountsByStatus = PolicyDocument::query()
            ->selectRaw('status, COUNT(*) as aggregate')
            ->groupBy('status')
            ->pluck('aggregate', 'status')
            ->toArray();

        $pendingReviews = Approval::query()
            ->with(['policyDocument', 'approver', 'policyVersion'])
            ->where('status', 'Pending')
            ->orderByDesc('action_at')
            ->limit(10)
            ->get();

        // Popular policies: use most recently updated policies.
        $topPolicies = PolicyDocument::query()
            ->orderByDesc('updated_at')
            ->limit(3)
            ->get();

        // Chart: acknowledgement activity in last 6 weeks.
        // We bin by week number from now.
        $now = now();
        $points = [];
        for ($i = 5; $i >= 0; $i--) {
            $from = $now->copy()->subWeeks($i)->startOfWeek();
            $to = $now->copy()->subWeeks($i)->endOfWeek();

            $count = Acknowledgement::query()
                ->whereBetween('created_at', [$from, $to])
                ->count();

            $points[] = ['label' => 'W' . (6 - $i), 'value' => $count];
        }
        $chart = $this->toSeries($points);

        // Department compliance pulse: percentage of policies per department vs total.
        $departmentAnalytics = $departments->map(function (Department $d) use ($totalPolicies) {
            $policyCount = PolicyDocument::query()->where('department_id', $d->id)->count();
            $progress = min(100, max(0, (int) round(($policyCount / max(1, $totalPolicies)) * 100)));
            return [
                'name' => $d->name,
                'progress' => $progress,
            ];
        })->values()->all();

        return [
            'stats' => [
                [
                    'title' => 'Total policies',
                    'value' => $totalPolicies,
                    'description' => 'Active governance documents',
                    'delta' => sprintf('%d pending review', $pendingReviews->count()),
                    'tone' => 'indigo',
                ],
                [
                    'title' => 'Departments',
                    'value' => $departments->count(),
                    'description' => 'Policy owning units',
                    'delta' => (string) array_sum(array_values($policyCountsByStatus)),
                    'tone' => 'green',
                ],
                [
                    'title' => 'Pending approvals',
                    'value' => $pendingReviews->count(),
                    'description' => 'Approvals awaiting action',
                    'delta' => (string) ($policyCountsByStatus['Under Review'] ?? 0) . ' in review',
                    'tone' => 'amber',
                ],
                [
                    'title' => 'Approved policies',
                    'value' => (int) ($policyCountsByStatus['Approved'] ?? 0),
                    'description' => 'Live policy content',
                    'delta' => (string) ($policyCountsByStatus['Draft'] ?? 0) . ' drafts',
                    'tone' => 'fuchsia',
                ],
            ],
            'departmentAnalytics' => $departmentAnalytics,
            'pendingReviews' => $pendingReviews->map(fn ($a) => [
                'id' => $a->id,
                'policy_document_id' => $a->policy_document_id,
                'status' => $a->status,
                'comments' => $a->comments,
                'action_at' => $a->action_at,
                'approver_user_id' => $a->approver_user_id,
                'approver' => $a->approver ? ['id' => $a->approver->id, 'name' => $a->approver->name, 'email' => $a->approver->email] : null,
                'policy_version' => $a->policyVersion ? ['id' => $a->policyVersion->id, 'title' => $a->policyVersion->title] : null,
                'policy_document' => $a->policyDocument ? [
                    'id' => $a->policyDocument->id,
                    'department_id' => $a->policyDocument->department_id,
                    'owner_user_id' => $a->policyDocument->owner_user_id,
                    'title' => $a->policyDocument->title,
                    'summary' => $a->policyDocument->summary,
                    'content' => null,
                    'visibility' => $a->policyDocument->visibility,
                    'status' => $a->policyDocument->status,
                    'mandatory' => (bool) $a->policyDocument->mandatory,
                    'effective_date' => optional($a->policyDocument->effective_date)->toDateString(),
                    'review_date' => optional($a->policyDocument->review_date)->toDateString(),
                    'current_version_id' => $a->policyDocument->current_version_id,
                    'created_at' => $a->policyDocument->created_at?->toISOString(),
                    'updated_at' => $a->policyDocument->updated_at?->toISOString(),
                ] : null,
            ])->values()->all(),
            'topPolicies' => $topPolicies->map(fn (PolicyDocument $p) => [
                'id' => $p->id,
                'department_id' => $p->department_id,
                'owner_user_id' => $p->owner_user_id,
                'title' => $p->title,
                'summary' => $p->summary,
                'content' => null,
                'visibility' => $p->visibility,
                'status' => $p->status,
                'mandatory' => (bool) $p->mandatory,
                'effective_date' => optional($p->effective_date)->toDateString(),
                'review_date' => optional($p->review_date)->toDateString(),
                'current_version_id' => $p->current_version_id,
                'created_at' => $p->created_at?->toISOString(),
                'updated_at' => $p->updated_at?->toISOString(),
            ])->values()->all(),
            'chart' => [
                'labels' => $chart['labels'],
                'datasets' => $chart['datasets'],
            ],
        ];
    }

    public function employeeDashboard(int $userId): array
    {
        $user = User::query()->findOrFail($userId);
        abort_unless(!$this->isAdmin($user), 403);

        $scopedPolicies = PolicyDocument::query();
        $scopedPolicies = $this->employeePolicyScopeQuery($scopedPolicies, $user);

        // Bookmarked policies within employee scope.
        $bookmarkedPolicyIds = Bookmark::query()
            ->where('user_id', $user->id)
            ->pluck('policy_document_id');

        $bookmarkedPolicies = PolicyDocument::query()
            ->whereIn('id', $bookmarkedPolicyIds)
            ->tap(fn (Builder $q) => $this->employeePolicyScopeQuery($q, $user))
            ->orderByDesc('updated_at')
            ->limit(20)
            ->get();

        $bookmarkedCount = $bookmarkedPolicies->count();

        // Pending acknowledgements.
        $pendingAcksQuery = Acknowledgement::query()
            ->where('user_id', $user->id)
            ->where('status', 'Pending')
            ->whereHas('policyDocument', function ($q) use ($user) {
                $this->employeePolicyScopeQuery($q, $user);
            });

        $pendingAcknowledgementsCount = (clone $pendingAcksQuery)->count();

        $pendingAcknowledgements = (clone $pendingAcksQuery)
            ->with(['policyDocument'])
            ->orderByDesc('acknowledged_at')
            ->limit(3)
            ->get();

        $recentReads = PolicyDocument::query()
            ->whereIn('id', $bookmarkedPolicyIds)
            ->tap(fn (Builder $q) => $this->employeePolicyScopeQuery($q, $user))
            ->orderByDesc('updated_at')
            ->limit(6)
            ->get();

        $recentUpdates = PolicyDocument::query()
            ->tap(fn (Builder $q) => $this->employeePolicyScopeQuery($q, $user))
            ->orderByDesc('updated_at')
            ->limit(6)
            ->get();

        // Chart: acknowledgement activity for employee scope.
        $now = now();
        $points = [];
        for ($i = 5; $i >= 0; $i--) {
            $from = $now->copy()->subWeeks($i)->startOfWeek();
            $to = $now->copy()->subWeeks($i)->endOfWeek();

            $count = Acknowledgement::query()
                ->where('user_id', $user->id)
                ->whereBetween('created_at', [$from, $to])
                ->count();

            $points[] = ['label' => 'W' . (6 - $i), 'value' => $count];
        }
        $chart = $this->toSeries($points);

        return [
            'stats' => [
                [
                    'title' => 'Pending Acknowledgements',
                    'value' => $pendingAcknowledgementsCount,
                    'description' => 'Actions requiring your sign-off',
                    'delta' => '+0 this week',
                    'tone' => 'amber',
                ],
                [
                    'title' => 'Bookmarked Policies',
                    'value' => $bookmarkedCount,
                    'description' => 'Saved for quick access',
                    'delta' => '+0',
                    'tone' => 'fuchsia',
                ],
                [
                    'title' => 'Recent Reads',
                    'value' => $recentReads->count(),
                    'description' => 'Policies reviewed this month',
                    'delta' => '+0',
                    'tone' => 'indigo',
                ],
            ],
            'pendingAcknowledgements' => $pendingAcknowledgements->map(fn ($ack) => [
                'policy_title' => $ack->policyDocument?->title,
                'policy_summary' => $ack->policyDocument?->summary,
                'badge' => 'Due',
                'badgeTone' => 'amber',
                'policy_document_id' => $ack->policy_document_id,
            ])->values()->all(),
            'recentUpdates' => $recentUpdates->map(fn (PolicyDocument $p) => [
                'title' => $p->title,
                'badge' => $p->status === 'Approved' ? 'Active' : 'New',
                'badgeTone' => $p->status === 'Approved' ? 'green' : 'indigo',
                'description' => $p->summary ?? '',
                'policy_document_id' => $p->id,
            ])->values()->all(),
            'bookmarkedPolicies' => $bookmarkedPolicies->map(fn (PolicyDocument $p) => [
                'title' => $p->title,
                'policy_document_id' => $p->id,
                'shared_by' => 'Compliance',
            ])->values()->all(),
            'chart' => [
                'labels' => $chart['labels'],
                'datasets' => $chart['datasets'],
            ],
        ];
    }
}

