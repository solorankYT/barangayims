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
use App\Models\ResidentFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

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
        Log::info('Registration request data: ', $request->all());
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
            'household' => 'nullable|exists:households,id',
        ]);

        if (User::where('email', $request->email)->exists()) {
            return back()->withErrors([
                'email' => 'This email is already registered.',
            ])->withInput();
        }

        try{
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
                'household_id' => $request->household,
            ]);

            if ($request->household_head) {
                $household = Household::create([
                    'name' => $request->first_name . "'s Household",
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
                $user->household_id = $household->id;
                $user->save();
            }

            if ($request->hasFile('valid_id')){
                $file = $request->file('valid_id');
                $fileName = 'valid_id_' . $user->id . '.' . $file->getClientOriginalExtension();
                $path = $file->storeAs('valid_ids', $fileName, 'resident_files');

                ResidentFile::create([
                    'resident_id' => $user->id,
                    'fileName' => $fileName,
                    'filePath' => $path,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

        }catch(\Exception $e){
            Log::info('Error creating user: ' . $e->getMessage());
            return back()->withErrors([
                'registration' => 'An error occurred while creating your account. Please try again later.',
            ])->withInput();
        }
        
        event(new Registered($user));
        return redirect(route('login', absolute: false));
    }
}