<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePolicyRequest extends FormRequest
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
            'department_id' => ['nullable', 'integer', 'exists:departments,id', 'required_if:visibility,Department'],
            'title' => ['required', 'string', 'max:255'],
            'summary' => ['nullable', 'string', 'max:2000'],
            'content' => ['required', 'string'],

            // PolicyDocument columns
            'visibility' => ['required', 'in:Public,Department,Private'],
            'status' => ['required', 'in:Draft,Under Review,Approved,Archived'],
            'mandatory' => ['sometimes', 'boolean'],
            'effective_date' => ['nullable', 'date'],
            'review_date' => ['nullable', 'date', 'after_or_equal:effective_date'],
        ];
    }
}
