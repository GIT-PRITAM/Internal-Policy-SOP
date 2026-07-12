<?php

namespace App\Http\Controllers;

use App\Services\DashboardService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __construct(
        private readonly DashboardService $service
    ) {
    }

    public function adminDashboard(Request $request): JsonResponse
    {
        $data = $this->service->adminDashboard(userId: $request->user()->id);

        return response()->json([
            'status' => 'success',
            'data' => $data,
        ]);
    }

    public function employeeDashboard(Request $request): JsonResponse
    {
        $data = $this->service->employeeDashboard(userId: $request->user()->id);

        return response()->json([
            'status' => 'success',
            'data' => $data,
        ]);
    }
}

