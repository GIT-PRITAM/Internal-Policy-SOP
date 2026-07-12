<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SubmitForReviewRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = $this->user();
        if (!$user) return false;
        return (string) $user->role?->name === 'Admin';
    }

    public function rules(): array
    {
        return [
            'change_summary' => ['nullable', 'string', 'max:1000'],
        ];
    }
}