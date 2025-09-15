<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\View;
use Symfony\Component\HttpFoundation\Response;

class HandleAppearance
{
  public function handle(Request $request, Closure $next): Response
  {
    $response = $next($request);

    View::share('appearance', $request->cookie('appearance') ?? 'system');

    return $response;
  }
}
