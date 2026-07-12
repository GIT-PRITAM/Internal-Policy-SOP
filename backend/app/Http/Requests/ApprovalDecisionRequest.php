<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ApprovalDecisionRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = $this->user();
        if (!$user) return false;

        // Scoped to existing role behavior (no auth changes).
        return (string) $user->role?->name === 'Admin';
    }

    public function rules(): array
    {
        return [
            'decision' => ['required', 'in:Approved,Rejected'],
            'comments' => ['nullable', 'string', 'max:5000'],
        ];
    }
}

