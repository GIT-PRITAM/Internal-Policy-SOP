<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ListBookmarksRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user();
    }

    public function rules(): array
    {
        return [
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:50'],
            'search' => ['sometimes', 'nullable', 'string', 'max:255'],
            'visibility' => ['sometimes', 'nullable', 'in:Public,Department,Private'],
            'department_id' => ['sometimes', 'nullable', 'integer', 'exists:departments,id'],
        ];
    }
}

