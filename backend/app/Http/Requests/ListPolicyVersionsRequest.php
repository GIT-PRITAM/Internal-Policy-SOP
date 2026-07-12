<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ListPolicyVersionsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
            'search' => ['nullable', 'string', 'max:255'],
            'sort_by' => ['nullable', 'string', 'in:created_at,version_number,approved_at'],
            'sort_dir' => ['nullable', 'string', 'in:asc,desc'],
        ];
    }
}