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

        return Inertia::render('AdminDocuments', [ // Matches the exact filename AdminDocuments.jsx
            'documentRequests' => $documentRequests,
            'users' => $users,
            'documentTypes' => $documentTypes,
        ]);

        return response()->json(['documentRequests' => $documentRequests, 'users' => $users, 'documentTypes' => $documentTypes]);
    }

    public function store(Request $request)
    {
        try {
            Log::info('Received document request creation:', $request->all());

            $validated = $request->validate([
                'userID' => 'required|exists:users,id',
                'documentTypeID' => 'required|exists:document_types,documentTypeID',
                'status' => 'required|string|max:50',
                'purpose' => 'required|string|max:255',
                'remarks' => 'nullable|string|max:255',
            ]);

            // Explicitly set documentID to NULL since it's not available yet
            $validated['documentID'] = null;

            $documentRequest = DocumentRequests::create($validated);

            Log::info('Document request created successfully:', ['documentRequest' => $documentRequest]);

            return redirect()->route('AdminDocuments')->with('success', 'Document request created successfully.');
        } catch (\Exception $e) {
            Log::error('Error creating document request:', ['message' => $e->getMessage()]);
            return back()->with('error', 'An error occurred while creating the document request.');
        }
    }


    public function update(Request $request, $id)
    {
        try {
            $documentRequest = DocumentRequests::findOrFail($id);

            $validated = $request->validate([
                'userID' => 'required|exists:users,id',
                'documentTypeID' => 'required|exists:document_types,documentTypeID',
                'status' => 'required|string|max:50',
                'purpose' => 'required|string|max:255',
                'remarks' => 'nullable|string|max:255',
            ]);

            $documentRequest->update($validated);

            return redirect()->route('admin.documents')->with('success', 'Document request updated successfully.');
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

            return response()->json(['message' => 'Document request deleted successfully.']);
        } catch (\Exception $e) {
            Log::error('Error deleting document request:', ['message' => $e->getMessage()]);
            return response()->json(['error' => 'An error occurred while deleting the document request.'], 500);
        }
    }
}
