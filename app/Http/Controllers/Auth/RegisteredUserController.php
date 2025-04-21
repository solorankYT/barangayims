<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Household;
use Illuminate\Support\Facades\Log;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'middle_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                'unique:users,email',
            ],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'birthday' => 'required|date|before:today',
            'address' => 'required|string|max:255',
            'gender' => 'required|string|in:male,female,other,prefer_not_to_say',
            'contact_number' => 'required|string|max:20|regex:/^[0-9+\- ]+$/',
            'city' => 'required|string|max:255',
            'zip_code' => 'required|string|max:10|regex:/^[0-9\- ]+$/',
            'household_head' => 'required|boolean',
        ]);

        if (User::where('email', $request->email)->exists()) {
            return back()->withErrors([
                'email' => 'This email is already registered.',
            ])->withInput();
        }

        $user = User::create([
            'name' => $request->first_name . ' ' . $request->middle_name . ' ' . $request->last_name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'birthday' => $request->birthday,
            'address' => $request->address,
            'gender' => $request->gender,
            'contact_number' => $request->contact_number,
            'city' => $request->city,
            'zip_code' => $request->zip_code,
            'household_head' => $request->household_head,
        ]);

        event(new Registered($user));
        return redirect(route('login', absolute: false));
    }
}