<?php

namespace App\Support;

use Illuminate\Pagination\LengthAwarePaginator;

final class PaginationMeta
{
    public static function from(LengthAwarePaginator $p): array
    {
        return [
            'total' => $p->total(),
            'per_page' => $p->perPage(),
            'current_page' => $p->currentPage(),
            'last_page' => $p->lastPage(),
        ];
    }
}

