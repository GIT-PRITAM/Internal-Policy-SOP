<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureRole
{
    /**
     * Handle an incoming request.
     *
     * Usage: ->middleware('role:Admin') or ->middleware('role:Employee')
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        $user = $request->user();
        if (!$user) {
            abort(401, 'Unauthenticated.');
        }

        if ((string) $user->role?->name !== $role) {
            abort(403, 'Forbidden.');
        }

        return $next($request);
    }
}

