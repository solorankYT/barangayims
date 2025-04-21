<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

use App\Models\User;
use App\Models\Household;
use App\Models\ResidentFile;


class ResidentController extends Controller
{
    public function index()
    {
        $residents = User::all();

        return Inertia::render('ResidentManagement', [
            'residents' => $residents
        ]);
    }

    public function store(Request $request)
    {
        try {
            Log::info('Received resident creation request:', $request->all());
    
            $validated = $request->validate([
                'first_name' => 'required|string|max:255',
                'last_name' => 'required|string|max:255',
                'middle_name' => 'nullable|string|max:255',
                'birthday' => 'required|date',
                'gender' => 'required|string|max:10',
                'email' => 'required|email|unique:users,email',
                'contact_number' => 'nullable|string|max:20',
                'address' => 'required|string|max:255',
                'city' => 'nullable|string|max:100',
                'zip_code' => 'nullable|string|max:10',
                'password' => 'required|string|min:6'
            ]);
    
            $resident = User::create([
                'name' => $validated['first_name'] . ' ' . $validated['last_name'] . ' ' . $validated['middle_name'],
                'birthday' => $validated['birthday'],
                'gender' => $validated['gender'],
                'email' => $validated['email'],
                'contact_number' => $validated['contact_number'],
                'address' => $validated['address'],
                'city' => $validated['city'],
                'zip_code' => $validated['zip_code'],
                'password' => Hash::make($validated['password']),
            ]);
    
            Log::info('Resident created successfully:', ['resident' => $resident]);
    
            return redirect()->route('residentmanagement')->with('success', 'Resident created successfully.');
        } catch (\Exception $e) {
            Log::error('Error creating resident:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
    
            return back()->with('error', 'An error occurred while creating the resident.');
        }
    }    

    public function show($id)
    {
        $resident = User::findOrFail($id);
        return response()->json($resident);
    }

    public function update(Request $request, $id)
    {
        try {
            $resident = User::findOrFail($id);
            Log::info('Resident found:', ['resident' => $resident]);
    
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'birthday' => 'required|date',
                'gender' => 'required|string|max:10',
                'email' => 'required|email|unique:users,email,' . $id,
                'contact_number' => 'nullable|string|max:20',
                'address' => 'required|string|max:255',
                'city' => 'nullable|string|max:100',
                'zip_code' => 'nullable|string|max:10',
            ]);
    
            Log::info('Validated Data:', $validated);
    
            $resident->update($validated);
    
            Log::info('Resident updated successfully:', ['resident' => $resident]);
    
            return redirect()->route('residentmanagement')->with('success', 'Resident updated successfully.');
        } catch (\Exception $e) {
            Log::error('Error updating resident:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
    
            return back()->with('error', 'An error occurred while updating the resident.');
        }
    }    

    public function destroy($id)
    {
        $resident = User::findOrFail($id);
        $resident->delete();

        return response()->json(['message' => 'Resident deleted successfully.']);
    }

    public function registerUser(Request $request)
    {
        Log::info('Registration request received: ', $request->all());

        try {
            if (!$request->hasFile('file')) {
                Log::info('No file received.');
                return response()->json(['error' => 'File is required.'], 422);
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
                'password' => 'required',
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
                    Log::info('Error creating household: ' . $e->getMessage(), ['exception' => $e]);
                    return response()->json(['error' => 'Failed to create household.'], 422);
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
                return response()->json(['error' => 'Failed to create user.'], 422);
            }
    
            try {
                $file = $request->file('file');
                $fileName = 'valid_id_' . $user->id . '.' . $file->getClientOriginalExtension();
                $path = $file->storeAs('valid_ids', $fileName, 'resident_files');
    
                $user->residentFiles()->updateOrCreate([
                    'resident_id' => $user->id,
                    'fileName' => $fileName,
                    'filePath' => $path,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            } catch (\Exception $e) {
                Log::error('Error uploading file: ' . $e->getMessage(), ['exception' => $e]);
                return response()->json(['error' => 'Failed to upload file.'], 422);
            }
    
            return response()->json(['message' => 'Registration successful.'], 200);
    
        } catch (\Exception $e) {
            Log::error('Unexpected error in registration: ' . $e->getMessage(), ['exception' => $e]);
            return response()->json(['error' => 'An unexpected error occurred.'], 500);
        }
    }
}
