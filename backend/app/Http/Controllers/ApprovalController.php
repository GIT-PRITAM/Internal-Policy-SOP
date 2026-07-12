<?php

namespace App\Http\Controllers;

use App\Models\Approval;
use App\Models\Notification;
use App\Models\User;

use App\Support\ApiResponse;
use App\Support\PaginationMeta;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ApprovalController extends Controller
{
    public function timeline(Request $request): JsonResponse
    {
        $perPage = (int) $request->integer('per_page', 10);
        $policyDocumentId = $request->integer('policy_document_id', null);
        $status = $request->string('status', null);

        $user = $request->user();
        $q = Approval::query()->with(['policyDocument', 'approver', 'policyVersion']);

        if ($policyDocumentId) {
            $q->where('policy_document_id', $policyDocumentId);
        }
        if ($status) {
            $q->where('status', $status);
        }

        // Admin sees all, employees see approvals for policies they can view
        if ((string) $user->role?->name !== 'Admin') {
            $q->whereHas('policyDocument', function ($qq) use ($user) {
                $qq->where('visibility', 'Public')
                    ->orWhere(function ($d) use ($user) {
                        $d->where('visibility', 'Department')
                            ->where('department_id', $user->department_id);
                    })
                    ->orWhere(function ($p) use ($user) {
                        $p->where('visibility', 'Private')
                            ->where('owner_user_id', $user->id);
                    });
            });
        }

        $p = $q->orderByDesc('action_at')->paginate(perPage: $perPage);

        return ApiResponse::success(
            data: [
                'items' => $p->items(),
                'meta' => PaginationMeta::from($p),
            ]
        );
    }

    public function decide(\App\Http\Requests\ApprovalDecisionRequest $request, int $approvalId): JsonResponse
    {
        $user = $request->user();


        $approval = Approval::query()
            ->with(['policyDocument', 'policyVersion'])
            ->findOrFail($approvalId);

        // Keep authorization scoped: do not change PolicyDocumentPolicy.
        abort_unless((string) $user->role?->name === 'Admin', 403);

        abort_unless($approval->status === 'Pending', 409);

        $decision = $request->validated('decision');
        $comments = $request->validated('comments');

        $approval->status = $decision;
        $approval->comments = $comments;
        $approval->action_at = now();
        $approval->save();

        // Minimal status transition based on existing PolicyDocument.status states.
        // Do not add new states.
        if ($decision === 'Approved') {
            $approval->policyDocument->status = 'Approved';
            $approval->policyDocument->current_version_id = $approval->policyVersion_id;
            $approval->policyDocument->review_date = now()->toDateString();
        } else {
            $approval->policyDocument->status = 'Draft';
        }

        $approval->policyDocument->save();

        // Notify the policy owner about the decision
        $policy = $approval->policyDocument;
        $notificationTitle = $decision === 'Approved' ? 'Policy approved' : 'Policy rejected';
        $notificationMessage = $decision === 'Approved'
            ? "Policy \"{$policy->title}\" has been approved."
            : "Policy \"{$policy->title}\" has been rejected.";

        if ($policy->owner_user_id) {
            Notification::query()->create([
                'user_id' => $policy->owner_user_id,
                'type' => $decision === 'Approved' ? 'policy_approved' : 'policy_rejected',
                'title' => $notificationTitle,
                'message' => $notificationMessage,
                'is_read' => false,
            ]);
        }

        // Also notify all other admins
        $adminRoleId = \App\Models\Role::query()->where('name', 'Admin')->value('id');
        $adminUsers = User::query()->where('role_id', $adminRoleId)->get();
        foreach ($adminUsers as $admin) {
            if ($admin->id === $policy->owner_user_id) continue;
            Notification::query()->create([
                'user_id' => $admin->id,
                'type' => $decision === 'Approved' ? 'policy_approved' : 'policy_rejected',
                'title' => $notificationTitle,
                'message' => $notificationMessage,
                'is_read' => false,
            ]);
        }

        return ApiResponse::success(
            data: [
                'approval_id' => $approval->id,
                'policy_document_id' => $approval->policy_document_id,
                'status' => $approval->status,
            ],
            message: $decision === 'Approved' ? 'Policy approved.' : 'Policy rejected.'
        );
    }
}


