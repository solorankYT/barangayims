<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\ResidentFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class ResidentController extends Controller
{
    public function index()
    {
        $residents = User::all();

        $baseUrl = config('app.url');
        foreach ($residents as $resident) {
            $valid_id = ResidentFile::where('resident_id', $resident->id)->first();
    
            if ($valid_id) {
                $resident->valid_id_url = $baseUrl . '/valid_ids/' . $valid_id->fileName; 
            } else {
                $resident->valid_id_url = null;
            }
        }
        Log::info('Residents data:', $residents->toArray());
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
                'zip_code' => 'nullable|string|max:10',
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

    public function handleVerification(Request $request, $id)
    {
        $request->validate([
            'isApproved' => 'required|boolean',
            'rejectionReason' => 'nullable|string',
        ]);

        $resident = User::findOrFail($id);

        if ($request->isApproved) {
            $resident->is_verified = true;
            $resident->verification_rejection_reason = null;
        } else {
            $resident->is_verified = false;
            $resident->verification_rejection_reason = $request->rejectionReason ?? 'No reason provided.';
        }

        $resident->save();

        return redirect()->route('residentmanagement')->with('success', 'Resident verification updated.');
    }
}
