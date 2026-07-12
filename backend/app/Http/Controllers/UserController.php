<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Role;
use App\Models\User;
use App\Support\ApiResponse;
use App\Support\PaginationMeta;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $perPage = (int) $request->integer('per_page', 10);
        $search = $request->string('search', null);

        $query = User::query()->with(['role', 'department']);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                    ->orWhere('email', 'ilike', "%{$search}%");
            });
        }

        $paginator = $query->orderByDesc('created_at')->paginate(perPage: $perPage);

        return ApiResponse::success(
            data: [
                'items' => $paginator->items(),
                'meta' => PaginationMeta::from($paginator),
            ]
        );
    }

    public function show(int $id): JsonResponse
    {
        $user = User::query()->with(['role', 'department'])->findOrFail($id);

        return ApiResponse::success(data: ['user' => $user]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'role_id' => ['required', 'integer', Rule::exists('roles', 'id')],
            'department_id' => ['nullable', 'integer', Rule::exists('departments', 'id')],
        ]);

        $user = User::query()->create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role_id' => $data['role_id'],
            'department_id' => $data['department_id'] ?? null,
        ]);

        return ApiResponse::success(data: ['user' => $user], message: 'User created', status: 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $user = User::query()->findOrFail($id);

        $data = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'email' => ['sometimes', 'required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'password' => ['sometimes', 'nullable', 'string', 'min:8'],
            'role_id' => ['sometimes', 'required', 'integer', Rule::exists('roles', 'id')],
            'department_id' => ['sometimes', 'nullable', 'integer', Rule::exists('departments', 'id')],
        ]);

        if (isset($data['password']) && $data['password']) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $user->update($data);
        $user->refresh();

        return ApiResponse::success(data: ['user' => $user], message: 'User updated');
    }

    public function destroy(int $id): JsonResponse
    {
        $user = User::query()->findOrFail($id);
        $user->delete();

        return ApiResponse::success(message: 'User deleted');
    }
}
