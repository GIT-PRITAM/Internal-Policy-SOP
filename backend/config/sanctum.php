<?php

use Laravel\Sanctum\Sanctum;

return [

    /*
    |--------------------------------------------------------------------------
    | Stateful Domains
    |--------------------------------------------------------------------------
    |
    | Requests from the following domains / hosts will receive stateful API
    | authentication cookies. Typically, this is for SPA frontend domains
    | where you may want to use session cookies.
    |
    */

    'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', 'localhost')),

    /*
    |--------------------------------------------------------------------------
    | Guards
    |--------------------------------------------------------------------------
    |
    | This array contains authentication guards that will be checked when
    | resolving the current authenticated user.
    |
    */

    'guards' => [
        'web',
    ],

    /*
    |--------------------------------------------------------------------------
    | Expiration Minutes
    |--------------------------------------------------------------------------
    |
    | Personal access tokens are short-lived by default unless you override
    | the expiration.
    |
    */

    'expiration' => env('SANCTUM_EXPIRATION', null),

    /*
    |--------------------------------------------------------------------------
    | Token Prefix
    |--------------------------------------------------------------------------
    |
    */

    'token_prefix' => env('SANCTUM_TOKEN_PREFIX', ''),

    /*
    |--------------------------------------------------------------------------
    | Middleware
    |--------------------------------------------------------------------------
    |
    | Allows configuring the middleware used by Sanctum.
    |
    */

    'middleware' => [
        'verify_csrf_token' => Laravel\Sanctum\Http\Middleware\VerifyCsrfToken::class,
        'encrypt_cookies' => Laravel\Sanctum\Http\Middleware\EncryptCookies::class,
    ],

    'use_stateful_api' => env('SANCTUM_STATEFUL_API', false),

    'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', 'localhost')),
];


