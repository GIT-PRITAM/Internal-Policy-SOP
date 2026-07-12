<?php

namespace App\Services;

use App\Models\PolicyDocument;
use App\Models\PolicyVersion;
use Illuminate\Pagination\LengthAwarePaginator;

class PolicyVersionService
{
    public function listByPolicy(int $policyId, int $perPage = 10, ?string $search = null, string $sortBy = 'created_at', string $sortDir = 'desc'): LengthAwarePaginator
    {
        $query = PolicyVersion::query()
            ->with(['creator:id,name,email', 'approver:id,name,email'])
            ->where('policy_document_id', $policyId);

        if ($search) {
            $needle = '%' . mb_strtolower($search) . '%';
            $query->where(function ($q) use ($needle) {
                $q->whereRaw('LOWER(COALESCE(title, \'\')) LIKE ?', [$needle])
                    ->orWhereRaw('LOWER(COALESCE(change_summary, \'\')) LIKE ?', [$needle]);
            });
        }

        $allowedSortBy = ['created_at', 'version_number', 'approved_at'];
        $sortBy = in_array($sortBy, $allowedSortBy) ? $sortBy : 'created_at';
        $sortDir = $sortDir === 'asc' ? 'asc' : 'desc';

        return $query->orderBy($sortBy, $sortDir)->paginate(perPage: $perPage);
    }

    public function createVersion(int $policyId, array $data): PolicyVersion
    {
        $policy = PolicyDocument::query()->findOrFail($policyId);

        // Determine next version number
        $latestVersion = PolicyVersion::query()
            ->where('policy_document_id', $policyId)
            ->orderByDesc('version_number')
            ->first();

        $nextVersionNumber = $latestVersion ? $latestVersion->version_number + 1 : 1;

        $version = PolicyVersion::query()->create([
            'policy_document_id' => $policyId,
            'version_number' => $nextVersionNumber,
            'title' => $data['title'] ?? $policy->title,
            'content' => $data['content'] ?? $policy->content,
            'change_summary' => $data['change_summary'] ?? null,
            'created_by' => $data['created_by'] ?? auth()->id(),
        ]);

        // Update the policy's current_version_id to point to this version
        // This is done to keep the existing current_version_id logic working
        // while not automatically changing policy content (the admin can decide)

        return $version;
    }

    public function latestByPolicy(int $policyId): PolicyVersion
    {
        $version = PolicyVersion::query()
            ->with(['creator:id,name,email', 'approver:id,name,email'])
            ->where('policy_document_id', $policyId)
            ->orderByDesc('version_number')
            ->firstOrFail();

        return $version;
    }

    public function getById(int $policyId, int $versionId): PolicyVersion
    {
        $version = PolicyVersion::query()
            ->with(['creator:id,name,email', 'approver:id,name,email'])
            ->where('policy_document_id', $policyId)
            ->where('id', $versionId)
            ->firstOrFail();

        return $version;
    }
}