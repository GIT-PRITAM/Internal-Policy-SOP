<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ApprovalController;
use App\Http\Controllers\BookmarkController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\PolicyDocumentController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PolicyVersionController;


Route::prefix('v1')->group(function () {
    Route::prefix('auth')->group(function () {
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/login', [AuthController::class, 'login']);
        Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
        Route::get('/me', [AuthController::class, 'me'])->middleware('auth:sanctum');
    });

    Route::middleware(['auth:sanctum'])->group(function () {
        // Departments
        Route::get('/departments', [DepartmentController::class, 'index']);
        Route::post('/departments', [DepartmentController::class, 'store'])->middleware('role:Admin');
        Route::get('/departments/{id}', [DepartmentController::class, 'show']);
        Route::put('/departments/{id}', [DepartmentController::class, 'update'])->middleware('role:Admin');
        Route::delete('/departments/{id}', [DepartmentController::class, 'destroy'])->middleware('role:Admin');

        // Policies
        Route::get('/policies', [PolicyDocumentController::class, 'index']);
        Route::post('/policies', [PolicyDocumentController::class, 'store'])->middleware('role:Admin');
        Route::get('/policies/{id}', [PolicyDocumentController::class, 'show']);
        Route::put('/policies/{id}', [PolicyDocumentController::class, 'update'])->middleware('role:Admin');
        Route::delete('/policies/{id}', [PolicyDocumentController::class, 'destroy'])->middleware('role:Admin');
        Route::post('/policies/{id}/submit-for-review', [PolicyDocumentController::class, 'submitForReview'])->middleware('role:Admin');

        // Bookmarks
        Route::get('/bookmarks', [BookmarkController::class, 'listMy']);
        Route::post('/bookmarks', [BookmarkController::class, 'add']);
        Route::delete('/bookmarks/{policy_id}', [BookmarkController::class, 'remove']);

        // User management
        Route::get('/users', [UserController::class, 'index'])->middleware('role:Admin');
        Route::get('/users/{id}', [UserController::class, 'show'])->middleware('role:Admin');
        Route::post('/users', [UserController::class, 'store'])->middleware('role:Admin');
        Route::put('/users/{id}', [UserController::class, 'update'])->middleware('role:Admin');
        Route::delete('/users/{id}', [UserController::class, 'destroy'])->middleware('role:Admin');

        // Dashboard (role-aware)
        Route::get('/dashboard/admin', [DashboardController::class, 'adminDashboard']);
        Route::get('/dashboard/employee', [DashboardController::class, 'employeeDashboard']);

        // Notifications
        Route::get('/notifications', [\App\Http\Controllers\NotificationController::class, 'list']);
        Route::patch('/notifications/{id}/read', [\App\Http\Controllers\NotificationController::class, 'markAsRead']);
        Route::patch('/notifications/read-all', [\App\Http\Controllers\NotificationController::class, 'markAllAsRead']);
        Route::get('/notifications/unread-count', [\App\Http\Controllers\NotificationController::class, 'unreadCount']);

        // Acknowledgements (employee workflow)
        Route::post('/acknowledgements/ack', [\App\Http\Controllers\AcknowledgementController::class, 'acknowledgePolicy']);
        Route::get('/acknowledgements/pending', [\App\Http\Controllers\AcknowledgementController::class, 'pendingAcknowledgements']);
        Route::get('/acknowledgements/completed', [\App\Http\Controllers\AcknowledgementController::class, 'completedAcknowledgements']);

        // Approval endpoints
        // History (existing)
        Route::get('/approvals/history', [ApprovalController::class, 'timeline']);

        // Approve/Reject (Admin-only, does not alter auth/authorization config)
        Route::post('/approvals/{approvalId}/decide', [ApprovalController::class, 'decide']);

        // Policy Versions
        Route::get('/policies/{id}/versions', [PolicyVersionController::class, 'listByPolicy']);
        Route::post('/policies/{id}/versions', [PolicyVersionController::class, 'createVersion'])->middleware('role:Admin');
        Route::get('/policies/{id}/versions/latest', [PolicyVersionController::class, 'latestByPolicy']);
        Route::get('/policies/{id}/versions/{versionId}', [PolicyVersionController::class, 'show']);
    });
});








