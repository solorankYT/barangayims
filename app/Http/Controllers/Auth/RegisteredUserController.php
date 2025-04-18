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
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                'unique:users,email', // This already checks if email exists
            ],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'birthday' => 'required|date|before:today',
            'address' => 'required|string|max:255',
            'gender' => 'required|string|in:male,female,other,prefer_not_to_say',
            'contact_number' => 'required|string|max:20|regex:/^[0-9+\- ]+$/',
            'city' => 'required|string|max:255',
            'zip_code' => 'required|string|max:10|regex:/^[0-9\- ]+$/',
            'household_head' => 'boolean',
            'household' => 'nullable|string|max:255',
            'file' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);
    
        if (User::where('email', $request->email)->exists()) {
            return back()->withErrors([
                'email' => 'This email is already registered.',
            ])->withInput();
        }
    
        if ($request->household_head) {
            $household = Household::updateOrCreate(['name' => ($request->name . "'s Household")]);
            $request->merge(['household' => $household->id]);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'birthday' => $request->birthday,
            'address' => $request->address,
            'gender' => $request->gender,
            'contact_number' => $request->contact_number,
            'city' => $request->city,
            'zip_code' => $request->zip_code,
            'household_head' => $request->household_head,
            'household' => $request->household,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $file = $request->file('file');
        $fileName = 'valid_id_' . $user->id . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs('valid_ids', $fileName, 'resident_files');
    
        $user->residentFiles()->updateOrCreate([
            'resident_id' => $user->id,
            'fileName' => $fileName,
            'filePath' => $path,
        ]);

        event(new Registered($user));
        return redirect(route('login', absolute: false));
    }
}