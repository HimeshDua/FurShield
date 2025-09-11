<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RedirectByRole
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user) {
            // echo ($user);
            switch ($user->role) {
                case 'owner':
                    return redirect()->route('owner.dashboard');
                case 'vet':
                    return redirect()->route('vet.dashboard');
                case 'shelter':
                    return redirect()->route('shelter.dashboard');
                case 'admin':
                    return redirect()->route('admin.dashboard');
            }
        }

        return redirect()->route('home'); // fallback for guests
    }
}
