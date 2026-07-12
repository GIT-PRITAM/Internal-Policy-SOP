<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PolicyDocumentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'department_id' => $this->department_id,
            'owner_user_id' => $this->owner_user_id,
            'title' => $this->title,
            'summary' => $this->summary,
            'content' => $request->boolean('include_content', false) ? $this->content : null,
            'visibility' => $this->visibility,
            'status' => $this->status,
            'mandatory' => (bool) $this->mandatory,
            'effective_date' => optional($this->effective_date)->toDateString(),
            'review_date' => optional($this->review_date)->toDateString(),
            'current_version_id' => $this->current_version_id,
            'created_at' => optional($this->created_at)->toISOString(),
            'updated_at' => optional($this->updated_at)->toISOString(),
        ];
    }
}

