<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreatePolicyVersionRequest;
use App\Http\Resources\PolicyVersionResource;
use App\Http\Requests\ListPolicyVersionsRequest;
use App\Services\PolicyVersionService;
use Illuminate\Http\JsonResponse;

class PolicyVersionController extends Controller
{
    public function __construct(
        private readonly PolicyVersionService $service
    ) {
    }

    public function listByPolicy(ListPolicyVersionsRequest $request, int $id): JsonResponse
    {
        $result = $this->service->listByPolicy(
            policyId: $id,
            perPage: $request->integer('per_page', 10),
            search: $request->string('search', null),
            sortBy: $request->string('sort_by', 'created_at'),
            sortDir: $request->string('sort_dir', 'desc'),
        );

        return response()->json(PolicyVersionResource::collection($result));
    }

    public function createVersion(CreatePolicyVersionRequest $request, int $id): JsonResponse
    {
        $version = $this->service->createVersion(
            policyId: $id,
            data: $request->validated()
        );

        return response()->json([
            'status' => 'success',
            'data' => new PolicyVersionResource($version),
        ], 201);
    }

    public function latestByPolicy(int $id): JsonResponse
    {
        $version = $this->service->latestByPolicy(policyId: $id);

        return response()->json([
            'status' => 'success',
            'data' => new PolicyVersionResource($version),
        ]);
    }

    public function show(int $policyId, int $versionId): JsonResponse
    {
        $version = $this->service->getById(policyId: $policyId, versionId: $versionId);

        return response()->json([
            'status' => 'success',
            'data' => new PolicyVersionResource($version),
        ]);
    }
}
