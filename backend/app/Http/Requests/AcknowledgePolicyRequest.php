<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AcknowledgePolicyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'policy_id' => ['required', 'integer', 'exists:policy_documents,id'],
        ];
    }
}

