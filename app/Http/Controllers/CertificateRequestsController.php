<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CertificateRequests;
use App\Models\User;
use App\Models\Certificates;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class CertificateRequestsController extends Controller
{
    public function index()
    {
        $certificateRequests = CertificateRequests::with('user')->get();
        $users = User::select('id', 'name')->get();

        return Inertia::render('AdminCertificate', [
            'certificateRequests' => $certificateRequests,
            'users' => $users,
        ]);

        return response()->json([
            'certificateRequests' => $certificateRequests,
            'users' => $users,
        ]);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'userID' => 'required|exists:users,id',
                'certificateType' => 'required|string|max:100',
                'purpose' => 'required|string|max:500',
                'remarks' => 'nullable|string|max:500',
            ]);
    
            $certificateRequest = CertificateRequests::create([
                'userID' => $validated['userID'],
                'certificateType' => $validated['certificateType'],
                'status' => 'Pending', // Default status
                'purpose' => $validated['purpose'],
                'remarks' => $validated['remarks'] ?? null,
            ]);
    
            return redirect()->route('admincertificate')->with('success', 'Certificate request created successfully.');
    
        } catch (\Exception $e) {
            Log::error('Certificate request creation failed: '.$e->getMessage());
            return back()->withInput()->with('error', 'Failed to create certificate request: '.$e->getMessage());
        }
    }

    public function update(Request $request, $id)
    {
        Log::info('Received certificate request update request:', $request->all());
        try {
            $certificateRequest = CertificateRequests::findOrFail($id);

            $validated = $request->validate([
                'userID' => 'required|exists:users,id',
                'certificateType' => 'required|string|max:100',
                'purpose' => 'required|string|max:255',
                'remarks' => 'nullable|string|max:255',
                'status' => 'required|string|max:100',
            ]);

            $certificateRequest->update($validated);

            return redirect()->route('admincertificate')->with('success', 'Certificate request updated successfully.');
        } catch (\Exception $e) {
            Log::error('Error updating certificate request:', ['message' => $e->getMessage()]);
            return back()->with('error', 'An error occurred while updating the certificate request.');
        }
    }

    public function destroy($id)
    {
        try {
            $certificateRequest = CertificateRequests::findOrFail($id);
            $certificateRequest->delete();

            return redirect()->route('admincertificate')->with('success', 'Certificate request deleted successfully.');
        } catch (\Exception $e) {
            Log::error('Error deleting certificate request:', ['message' => $e->getMessage()]);
            return back()->with('error', 'An error occurred while deleting the certificate request.');
        }
    }
}
