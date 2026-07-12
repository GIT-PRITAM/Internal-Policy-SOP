<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ListPoliciesRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'page' => ['sometimes', 'integer', 'min:1'],
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:100'],
            'search' => ['sometimes', 'nullable', 'string', 'max:255'],
            'department_id' => ['sometimes', 'nullable', 'integer', 'exists:departments,id'],
            'visibility' => ['sometimes', 'nullable', 'in:Public,Department,Private'],
            'status' => ['sometimes', 'nullable', 'in:Draft,Under Review,Approved,Archived'],
            'mandatory' => ['sometimes', 'boolean'],
            'include_content' => ['sometimes', 'boolean'],
        ];
    }
}
