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
        Log::info($residents);

        return Inertia::render('ResidentManagement', [
            'residents' => $residents
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
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
            'name' => $request->name,
            'birthday' => $request->birthday,
            'gender' => $request->gender,
            'email' => $request->email,
            'contact_number' => $request->contact_number,
            'address' => $request->address,
            'city' => $request->city,
            'state' => $request->state,
            'zip_code' => $request->zip_code,
            'household_number' => $request->household_number,
            'password' => Hash::make($request->password),
        ]);

        return redirect()->route('residentmanagement')->with('success', 'Resident created successfully.');
    }

    public function show($id)
    {
        $resident = User::findOrFail($id);
        return response()->json($resident);
    }

    public function update(Request $request, $id)
    {
        $resident = User::findOrFail($id);

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

        $resident->update($validated);

        return redirect()->route('residentmanagement')->with('success', 'Resident updated successfully.');
    }

    public function destroy($id)
    {
        $resident = User::findOrFail($id);
        $resident->delete();

        return response()->json(['message' => 'Resident deleted successfully.']);
    }
}
