<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePolicyRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = $this->user();
        if (!$user) {
            return false;
        }

        return $user->role?->name === 'Admin';

    }

    public function rules(): array
    {
        return [
            'department_id' => ['sometimes', 'nullable', 'integer', 'exists:departments,id', 'required_if:visibility,Department'],
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'summary' => ['sometimes', 'nullable', 'string', 'max:2000'],
            'content' => ['sometimes', 'required', 'string'],

            'visibility' => ['sometimes', 'required', 'in:Public,Department,Private'],
            'status' => ['sometimes', 'required', 'in:Draft,Under Review,Approved,Archived'],
            'mandatory' => ['sometimes', 'boolean'],
            'effective_date' => ['sometimes', 'nullable', 'date'],
            'review_date' => ['sometimes', 'nullable', 'date', 'after_or_equal:effective_date'],
        ];
    }
}
