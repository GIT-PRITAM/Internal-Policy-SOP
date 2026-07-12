<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Support\ApiResponse;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(RegisterRequest $request): JsonResponse
    {
        $data = $request->validated();

        $user = \App\Models\User::query()->create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role_id' => $data['role_id'] ?? null,
            'department_id' => $data['department_id'] ?? null,
        ]);

        event(new Registered($user));

        // Issue Sanctum personal access token
        $token = $user->createToken('auth-'.Str::random(8))->plainTextToken;

        return ApiResponse::success(
            data: [
                'user' => $user,
                'token' => $token,
            ],
            message: 'Registered successfully',
            status: 201
        );
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $data = $request->validated();

        $user = \App\Models\User::query()
            ->where('email', $data['email'])
            ->first();

        if (!$user || !Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return ApiResponse::success(
            data: [
                'user' => $user,
                'token' => $token,
                'token_type' => 'Bearer',
            ],
            message: 'Login successful'
        );
    }

    public function logout(Request $request): JsonResponse
    {
        $user = $request->user();
        if ($user) {
            $user->tokens()->delete();
        }

        return ApiResponse::success(message: 'Logged out successfully');
    }

    public function me(Request $request): JsonResponse
    {
        $user = $request->user();
        return ApiResponse::success(data: ['user' => $user]);
    }
}

