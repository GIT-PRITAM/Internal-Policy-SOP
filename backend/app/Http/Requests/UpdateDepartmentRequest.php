<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateDepartmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role?->name === 'Admin';
    }

    public function rules(): array
    {
        $id = (int) $this->route('id');

        return [
            'name' => ['sometimes', 'required', 'string', 'max:100', 'unique:departments,name,'.$id],
            'description' => ['sometimes', 'nullable', 'string', 'max:1000'],
        ];
    }
}

