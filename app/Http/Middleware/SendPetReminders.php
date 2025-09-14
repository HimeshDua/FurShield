<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class SendPetReminders
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        if ($request->user()?->isOwner()) {

            $pets = $request->user()->pets()->with('images')->get();

            $reminders = [];
            foreach ($pets as $pet) {
                if ($pet->next_vaccination_at && now()->diffInDays($pet->next_vaccination_at, false) <= 7) {
                    $reminders[] = [
                        'title'       => "Vaccination due soon",
                        'description' => "{$pet->name} vaccination due on {$pet->next_vaccination_at->format('M d, Y')}",
                        'due_at'      => $pet->next_vaccination_at,
                    ];
                }

                if ($pet->next_food_at && now()->diffInMinutes($pet->next_food_at, false) <= 60) {
                    $reminders[] = [
                        'title'       => "Feeding time soon",
                        'description' => "{$pet->name} needs food at {$pet->next_food_at->format('H:i')}",
                        'due_at'      => $pet->next_food_at,
                    ];
                }
            }

            Inertia::share('petReminders', $reminders);
        }

        return $response;
    }
}
