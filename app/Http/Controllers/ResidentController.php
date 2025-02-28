<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

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
                'name' => 'required|string|max:255',
                'birthday' => 'required|date',
                'gender' => 'required|string|max:10',
                'email' => 'required|email|unique:users,email',
                'contact_number' => 'nullable|string|max:20',
                'address' => 'required|string|max:255',
                'city' => 'nullable|string|max:100',
                'state' => 'nullable|string|max:100',
                'zip_code' => 'nullable|string|max:10',
                'household_number' => 'nullable|string|max:50',
                'password' => 'required|string|min:6'
            ]);
    
            $resident = User::create([
                'name' => $validated['name'],
                'birthday' => $validated['birthday'],
                'gender' => $validated['gender'],
                'email' => $validated['email'],
                'contact_number' => $validated['contact_number'],
                'address' => $validated['address'],
                'city' => $validated['city'],
                'state' => $validated['state'],
                'zip_code' => $validated['zip_code'],
                'household_number' => $validated['household_number'],
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
                'state' => 'nullable|string|max:100',
                'zip_code' => 'nullable|string|max:10',
                'household_number' => 'nullable|string|max:50',
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
}
