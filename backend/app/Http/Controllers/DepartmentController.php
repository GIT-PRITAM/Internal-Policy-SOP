<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDepartmentRequest;
use App\Http\Requests\UpdateDepartmentRequest;
use App\Http\Resources\DepartmentResource;
use App\Models\Department;
use App\Support\ApiResponse;
use App\Support\PaginationMeta;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;

class DepartmentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $perPage = (int) $request->integer('per_page', 10);
        $search = $request->string('search', null);

        $query = Department::query();
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                    ->orWhere('description', 'ilike', "%{$search}%");
            });
        }

        $paginator = $query
            ->orderByDesc('created_at')
            ->paginate(perPage: $perPage);

        return ApiResponse::success(
            data: [
                'items' => DepartmentResource::collection($paginator),
                'meta' => PaginationMeta::from($paginator),
            ]
        );
    }

    public function store(StoreDepartmentRequest $request): JsonResponse
    {
        $dept = Department::query()->create($request->validated());

        return ApiResponse::success(
            data: ['department' => new DepartmentResource($dept)],
            message: 'Department created',
            status: 201
        );
    }

    public function show(int $id): JsonResponse
    {
        $dept = Department::query()->findOrFail($id);
        return ApiResponse::success(data: ['department' => new DepartmentResource($dept)]);
    }

    public function update(UpdateDepartmentRequest $request, int $id): JsonResponse
    {
        $dept = Department::query()->findOrFail($id);
        $dept->update($request->validated());

        return ApiResponse::success(
            data: ['department' => new DepartmentResource($dept)],
            message: 'Department updated'
        );
    }

    public function destroy(int $id): JsonResponse
    {
        $dept = Department::query()->findOrFail($id);
        $dept->delete();

        return ApiResponse::success(message: 'Department deleted');
    }
}

