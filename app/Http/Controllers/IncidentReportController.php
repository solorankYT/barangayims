<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\IncidentReport;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class IncidentReportController extends Controller
{
    /**
     * Display a listing of the incident reports.
     */
    public function index()
    {
        $incidents = IncidentReport::with('resident:id,name')->get();
        $residents = User::select('id', 'name')->get(); 

        return Inertia::render('IncidentReport', [
            'incidents' => $incidents,
            'residents' => $residents
        ]);

        // return response()->json(['incidents' => $incidents, 'residents' => $residents]);
    }

    /**
     * Store a newly created incident report.
     */
    public function store(Request $request)
    {
        try {
            Log::info('Received incident report creation request:', $request->all());

            $validated = $request->validate([
                'resident_id' => 'required|exists:users,id', // resident_id is required
                'title' => 'required|string|max:255',
                'incident_type' => 'required|string|max:100',
                'description' => 'required|string|max:500',
                'status' => 'required|string|max:50',
            ]);

            $incident = IncidentReport::create($validated);

            Log::info('Incident report created successfully:', ['incident' => $incident]);

            return redirect()->route('incidentreports')->with('success', 'Incident report created successfully.');
        } catch (\Exception $e) {
            Log::error('Error creating incident report:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return back()->with('error', 'An error occurred while creating the incident report.');
        }
    }

    /**
     * Show a specific incident report.
     */
    public function show($id)
    {
        $incident = IncidentReport::with('resident')->findOrFail($id);
        return response()->json($incident);
    }

    /**
     * Update the specified incident report.
     */
    public function update(Request $request, $id)
    {
        try {
            $incident = IncidentReport::findOrFail($id);

            $validated = $request->validate([
                'resident_id' => 'required|exists:users,id',
                'title' => 'required|string|max:255',
                'incident_type' => 'required|string|max:100',
                'description' => 'required|string|max:500',
                'status' => 'required|string|max:50',
            ]);

            $incident->update($validated);

            return redirect()->route('incidentreports')->with('success', 'Incident report updated successfully.');
        } catch (\Exception $e) {
            Log::error('Error updating incident report:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return back()->with('error', 'An error occurred while updating the incident report.');
        }
    }

    /**
     * Remove the specified incident report.
     */
    public function destroy($id)
    {
        $incident = IncidentReport::findOrFail($id);
        $incident->delete();

        return response()->json(['message' => 'Incident report deleted successfully.']);
    }
}
