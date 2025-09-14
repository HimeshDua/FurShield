<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use App\Models\CustomerRequest;
use App\Models\User;
use App\Models\VetProfile;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        $userId = Auth::user()->id;
        $isRequestSend = CustomerRequest::where('user_id', $userId)->get('id');

        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
            'isRequestSend' => $isRequestSend ?? []

        ]);
    }

    /**
     * Update the user's profile settings.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return to_route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }

    public function requestVeterinarianAccess(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        // Find the logged in user by email
        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return back()->with('error', "No user found with this email. Please log in and try again.");
        }

        // Allow only owners to request vet access
        if ($user->role !== 'owner') {
            return back()->with('error', "Only pet owners can request to become a Veterinarian.");
        }

        // Store or retrieve existing request
        $userRequest = VetProfile::firstOrCreate(
            ['user_id' => $user->id],
            [
                'email' => $request->email,
                'status' => 'pending', // optional field
            ]
        );

        return back()->with('success', "Your request to become a Veterinarian has been sent successfully! Our team will review it shortly.");
    }

     public function updateOwnerRole(Request $request) // params
    {

        $user = User::findOrFail(Auth::user()->id);
        $user->role = 'vet';
        $user->save();
        return back()->with('success', 'Role updated successfully.');
    }

}
