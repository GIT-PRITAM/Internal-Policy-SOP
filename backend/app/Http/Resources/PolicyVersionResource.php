<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PolicyVersionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'policy_document_id' => $this->policy_document_id,
            'version_number' => $this->version_number,
            'title' => $this->title,
            'content' => $request->boolean('include_content', false) ? $this->content : null,
            'change_summary' => $this->change_summary,
            'created_by' => $this->created_by,
            'approved_by' => $this->approved_by,
            'approved_at' => optional($this->approved_at)->toISOString(),
            'created_at' => optional($this->created_at)->toISOString(),
            'updated_at' => optional($this->updated_at)->toISOString(),
        ];
    }
}

