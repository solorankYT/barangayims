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
        ]);

    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'userID' => 'required|exists:users,id',
                'documentTypeID' => 'required|exists:document_types,documentTypeID',
                'purpose' => 'required|string|max:255',
                'remarks' => 'nullable|string|max:255',
            ]);

            $validated['documentID'] = null;

            DocumentRequests::create([
                'userID' => $request->userID,
                'documentTypeID' => $request->documentTypeID,
                'status' => "Pending",
                'purpose' => $request->purpose,
                'remarks' => $request->remarks,
                'documentID' => null,
            ]);

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
