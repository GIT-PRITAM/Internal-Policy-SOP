<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePolicyRequest;
use App\Http\Requests\UpdatePolicyRequest;
use App\Http\Requests\ListPoliciesRequest;
use App\Http\Requests\SubmitForReviewRequest;
use App\Http\Resources\PolicyDocumentResource;
use App\Models\Approval;
use App\Models\Notification;
use App\Models\PolicyDocument;
use App\Models\User;
use App\Support\ApiResponse;
use App\Support\PaginationMeta;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PolicyDocumentController extends Controller
{
    public function index(ListPoliciesRequest $request): JsonResponse
    {
        $this->authorize('viewAny', PolicyDocument::class);

        $perPage = $request->integer('per_page', 10);
        $search = $request->input('search');
        $departmentId = $request->input('department_id');
        $visibility = $request->input('visibility');
        $status = $request->input('status');

        $query = PolicyDocument::query();

        if ($request->filled('search')) {
            $needle = '%'.mb_strtolower($search).'%';
            $query->where(function ($q) use ($search) {
                $needle = '%'.mb_strtolower($search).'%';
                $q->whereRaw('LOWER(title) LIKE ?', [$needle])
                    ->orWhereRaw('LOWER(COALESCE(summary, \'\')) LIKE ?', [$needle]);
            });
        }

        if ($request->filled('department_id')) {
            $query->where('department_id', $departmentId);
        }

        if ($request->filled('visibility')) {
            $query->where('visibility', $visibility);
        }

        if ($request->filled('status')) {
            $query->where('status', $status);
        }

        if ($request->has('mandatory')) {
            $query->where('mandatory', $request->boolean('mandatory'));
        }

        // Authorization: filter by PolicyDocumentPolicy view
        $query->where(function ($q) use ($request) {
            $user = $request->user();
            if (!$user) {
                $q->whereRaw('1=0');
                return;
            }

            if ((string) $user->role?->name === 'Admin') {
                $q->whereRaw('1=1');
                return;
            }

            $q->where('status', 'Approved')
                ->where(function ($visibilityQuery) use ($user) {
                    $visibilityQuery->where('visibility', 'Public')
                        ->orWhere(function ($qq) use ($user) {
                            $qq->where('visibility', 'Department')
                                ->where('department_id', $user->department_id);
                        })
                        ->orWhere(function ($qq) use ($user) {
                            $qq->where('visibility', 'Private')
                                ->where('owner_user_id', $user->id);
                        });
                });
        });

        $paginator = $query
            ->orderByDesc('created_at')
            ->paginate(perPage: $perPage);

        return ApiResponse::success(
            data: [
                'items' => PolicyDocumentResource::collection($paginator),
                'meta' => PaginationMeta::from($paginator),
            ]
        );
    }

    public function store(StorePolicyRequest $request): JsonResponse
    {
        $this->authorize('create', PolicyDocument::class);

        $policy = PolicyDocument::query()->create($request->validated() + [
            'owner_user_id' => $request->user()->id,
        ]);

        return ApiResponse::success(
            data: ['policy' => new PolicyDocumentResource($policy)],
            message: 'Policy created',
            status: 201
        );
    }

    public function show(int $id, Request $request): JsonResponse
    {
        $policy = PolicyDocument::query()->with(['department', 'owner', 'currentVersion'])->findOrFail($id);

        $this->authorize('view', $policy);

        return ApiResponse::success(data: ['policy' => new PolicyDocumentResource($policy)]);
    }

    public function update(UpdatePolicyRequest $request, int $id): JsonResponse
    {
        $policy = PolicyDocument::query()->findOrFail($id);
        $this->authorize('update', $policy);

        $policy->update($request->validated());

        return ApiResponse::success(
            data: ['policy' => new PolicyDocumentResource($policy)],
            message: 'Policy updated'
        );
    }

    public function destroy(int $id): JsonResponse
    {
        $policy = PolicyDocument::query()->findOrFail($id);
        $this->authorize('delete', $policy);

        $policy->delete();

        return ApiResponse::success(message: 'Policy deleted');
    }

    public function submitForReview(SubmitForReviewRequest $request, int $id): JsonResponse
    {
        $policy = PolicyDocument::query()->findOrFail($id);
        $this->authorize('update', $policy);

        // Only Draft policies can be submitted for review
        abort_unless($policy->status === 'Draft', 409, 'Only Draft policies can be submitted for review.');

        // Check for existing pending approval to prevent duplicates
        $existingPending = Approval::query()
            ->where('policy_document_id', $id)
            ->where('status', 'Pending')
            ->exists();

        abort_if($existingPending, 409, 'This policy already has a pending approval.');

        // Create a version snapshot if one doesn't exist
        $latestVersion = $policy->versions()->orderByDesc('version_number')->first();
        if (!$latestVersion) {
            $latestVersion = $policy->versions()->create([
                'version_number' => 1,
                'title' => $policy->title,
                'content' => $policy->content,
                'change_summary' => $request->input('change_summary', 'Initial version submitted for review'),
                'created_by' => $request->user()->id,
            ]);
        }

        // Transition policy to Under Review
        $policy->status = 'Under Review';
        $policy->save();

        // Find all Admin users to assign as approvers
        $adminRoleId = \App\Models\Role::query()->where('name', 'Admin')->value('id');
        $adminUsers = User::query()->where('role_id', $adminRoleId)->get();

        // Create one pending Approval record (reuse existing Approval model)
        // Use the first admin as the primary approver
        $approverId = $adminUsers->first()?->id ?? $request->user()->id;

        $approval = Approval::query()->create([
            'policy_document_id' => $policy->id,
            'policy_version_id' => $latestVersion->id,
            'approver_user_id' => $approverId,
            'status' => 'Pending',
            'action_at' => now(),
        ]);

        // Create notifications for all admin users
        foreach ($adminUsers as $admin) {
            Notification::query()->create([
                'user_id' => $admin->id,
                'type' => 'approval_required',
                'title' => 'Policy review requested',
                'message' => "Policy \"{$policy->title}\" has been submitted for review.",
                'is_read' => false,
            ]);
        }

        return ApiResponse::success(
            data: [
                'policy' => new PolicyDocumentResource($policy),
                'approval_id' => $approval->id,
            ],
            message: 'Policy submitted for review.',
            status: 200
        );
    }
}
