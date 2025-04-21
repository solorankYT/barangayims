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
        Log::info('Registration request received: ', $request->all());
    
        try {
            if (!$request->hasFile('file')) {
                Log::info('No file received.');
                return back()->withErrors(['file' => 'File is required.'])->withInput();
            }
    
            $request->validate([
                'first_name' => 'required|string|max:255',
                'middle_name' => 'nullable|string|max:255',
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
                'household_head' => 'nullable|boolean',
                'household' => 'nullable|exists:households,id',
                'file' => 'required|image|mimes:jpeg,png,jpg|max:2048',
            ]);
    
            if ($request->household_head) {
                try {
                    $householdName = $request->first_name ? ($request->first_name . "'s Household") : 'Unnamed Household';
                    $household = Household::updateOrCreate(['name' => $householdName]);
                    $request->merge(['household' => $household->id]);
                } catch (\Exception $e) {
                    Log::error('Error creating household: ' . $e->getMessage(), ['exception' => $e]);
                    return back()->withErrors(['household' => 'Failed to create household.'])->withInput();
                }
            }
    
            try {
                $user = User::create([
                    'name' => trim($request->first_name . ' ' . $request->middle_name . ' ' . $request->last_name),
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
            } catch (\Exception $e) {
                Log::error('Error creating user: ' . $e->getMessage(), ['exception' => $e]);
                return back()->withErrors(['user' => 'Failed to create user.'])->withInput();
            }
    
            try {
                $file = $request->file('file');
                $fileName = 'valid_id_' . $user->id . '.' . $file->getClientOriginalExtension();
                $path = $file->storeAs('valid_ids', $fileName, 'resident_files');
    
                $user->residentFiles()->updateOrCreate([
                    'user_id' => $user->id,
                    'fileName' => $fileName,
                    'filePath' => $path,
                ]);
            } catch (\Exception $e) {
                Log::error('Error uploading file: ' . $e->getMessage(), ['exception' => $e]);
                return back()->withErrors(['file' => 'Failed to upload file.'])->withInput();
            }
    
            try {
                event(new Registered($user));
            } catch (\Exception $e) {
                Log::error('Error dispatching Registered event: ' . $e->getMessage(), ['exception' => $e]);
                return back()->withErrors(['event' => 'Failed to dispatch registration event.'])->withInput();
            }
    
            return redirect()->route('login');
        } catch (\Exception $e) {
            Log::error('Unexpected error in registration: ' . $e->getMessage(), ['exception' => $e]);
            return back()->withErrors(['error' => 'An unexpected error occurred.'])->withInput();
        }
    }
}