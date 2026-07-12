<?php

namespace App\Http\Controllers;

use App\Http\Requests\AcknowledgePolicyRequest;
use App\Http\Requests\ListAcknowledgementsRequest;
use App\Http\Resources\PolicyDocumentResource;
use App\Services\AcknowledgementService;
use Illuminate\Http\JsonResponse;

class AcknowledgementController extends Controller
{
    public function __construct(
        private readonly AcknowledgementService $service
    ) {
    }

    public function acknowledgePolicy(AcknowledgePolicyRequest $request): JsonResponse
    {
        $ack = $this->service->acknowledge(
            userId: $request->user()->id,
            policyId: $request->integer('policy_id')
        );

        return response()->json([
            'status' => 'success',
            'data' => [
                'acknowledgement_id' => $ack->id,
                'policy_id' => $ack->policy_document_id,
                'acknowledged_at' => $ack->acknowledged_at,
            ],
        ], 201);
    }

    public function pendingAcknowledgements(ListAcknowledgementsRequest $request): JsonResponse
    {
        $q = $this->service->pending(
            userId: $request->user()->id,
            perPage: $request->integer('per_page', 10),
            search: $request->string('search', null)
        );

        return response()->json([
            'status' => 'success',
            'data' => PolicyDocumentResource::collection($q),
            'meta' => [
                'total' => $q->total(),
                'per_page' => $q->perPage(),
                'current_page' => $q->currentPage(),
                'last_page' => $q->lastPage(),
            ],
        ]);
    }

    public function completedAcknowledgements(ListAcknowledgementsRequest $request): JsonResponse
    {
        $q = $this->service->completed(
            userId: $request->user()->id,
            perPage: $request->integer('per_page', 10),
            search: $request->string('search', null)
        );

        return response()->json([
            'status' => 'success',
            'data' => PolicyDocumentResource::collection($q),
            'meta' => [
                'total' => $q->total(),
                'per_page' => $q->perPage(),
                'current_page' => $q->currentPage(),
                'last_page' => $q->lastPage(),
            ],
        ]);
    }
}

