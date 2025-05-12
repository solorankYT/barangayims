<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DocumentRequests;
use App\Models\User;
use App\Models\DocumentTypes;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class DocumentRequestController extends Controller
{
    public function index()
    {
        $documentRequests = DocumentRequests::with(['user', 'documentType:documentTypeID,name'])->get();
        $users = User::select('id', 'name')->get();
        $documentTypes = DocumentTypes::select('documentTypeID', 'name')->get();

        return Inertia::render('AdminDocuments', [
            'documentRequests' => $documentRequests,
            'users' => $users,
            'documentTypes' => $documentTypes,
        ],
    );
    }
    public function store(Request $request)
    {
        Log::info('Requests', $request->all());
        try {
            $validated = $request->validate([
                'userID' => 'required|exists:users,id',
                'documentTypeID' => 'required|exists:document_types,documentTypeID',
                'pickupOption' => 'nullable|string|max:50',
                'purpose' => 'required|string|max:255',
                'remarks' => 'nullable|string|max:255',
                'status' => 'required|string|max:50',
            ]);
    
            DocumentRequests::create([
                'userID' => $request->userID,
                'documentTypeID' => $request->documentTypeID,
                'status' => "Pending",
                'purpose' => $request->purpose,
                'pickupOption' => $request->pickupOption,
                'remarks' => $request->remarks,
            ]);
    
            return redirect()->route('AdminDocuments')->with('success', 'Document request created successfully.');
        } catch (\Exception $e) {
            Log::error('Error creating document request:', ['message' => $e->getMessage()]);
            return back()->with('error', 'An error occurred while creating the document request.');
        }
    }

    public function update(Request $request, $id)
    {
        Log::info('Update Request Payload:', $request->all());
    
        try {
            $documentRequest = DocumentRequests::where('documentRequestID', $id)->firstOrFail();
    
            // Handle minimal updates (like status only)
            if ($request->has('status') && !$request->has('userID')) {
                $validated = $request->validate([
                    'status' => 'required|string|max:50',
                    'staff_notes' => 'nullable|string|max:255',
                ]);
                $documentRequest->update($validated);
                return back()->with('success', 'Status updated successfully.');
            }
    
            // Handle full update from modal form
            $validated = $request->validate([
                'userID' => 'required|exists:users,id',
                'documentTypeID' => 'required|exists:document_types,documentTypeID',
                'status' => 'required|string|max:50',
                'purpose' => 'required|string|max:255',
                'pickupOption' => 'nullable|string|max:50',
                'remarks' => 'nullable|string|max:255',
                'staff_notes' => 'nullable|string|max:255',
            ]);
    
            $documentRequest->update([
                'userID' => $validated['userID'],
                'documentTypeID' => $validated['documentTypeID'],
                'status' => $validated['status'],
                'purpose' => $validated['purpose'],
                'pickupOption' => $validated['pickupOption'] ?? null,
                'remarks' => $validated['remarks'] ?? null,
                'staff_notes' => $validated['staff_notes'] ?? null,
            ]);
    
            return back()->with('success', 'Document request updated successfully.');
        } catch (\Exception $e) {
            Log::error('Error updating document request:', ['message' => $e->getMessage()]);
            return back()->with('error', 'An error occurred while updating the document request.');
        }
    }
    

    public function destroy($id)
    {
        try {
            $documentRequest = DocumentRequests::findOrFail($id);
            $documentRequest->delete();

        } catch (\Exception $e) {
           
        }
    }
}
