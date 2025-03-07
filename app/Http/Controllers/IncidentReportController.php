<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\IncidentReport;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class IncidentReportController extends Controller
{

    public function index()
    {
        $incidents = IncidentReport::with('resident:id,name')->get();
        $residents = User::select('id', 'name')->get(); 

        return Inertia::render('IncidentReport', [
            'incidents' => $incidents,
            'residents' => $residents
        ]);
    }


    public function store(Request $request)
    {
        try {
            Log::info('Received incident report creation request:', $request->all());

            $request->validate([
                'resident_id' => 'required|exists:users,id',
                'title' => 'required|string|max:255',
                'incidentType' => 'required|string|max:100',
                'description' => 'required|string|max:500',
            ]);

            IncidentReport::create([
                'residentID' => $request->resident_id,
                'title' => $request->title,
                'incidentType' => $request->incidentType,
                'description' => $request->description,
                'status' => 'Pending',
            ]);

        } catch (\Exception $e) {
            Log::error('Error creating incident report:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
        }
    }

    public function show($id)
    {
        $incident = IncidentReport::with('resident')->findOrFail($id);
        return response()->json($incident);
    }

    public function update(Request $request, $id)
    {
        try {
            $incident = IncidentReport::findOrFail($id);

            $validated = $request->validate([
                'resident_id' => 'required|exists:users,id',
                'title' => 'required|string|max:255',
                'incidentType' => 'required|string|max:100',
                'description' => 'required|string|max:500',
                'status' => 'required|string|max:50',
            ]);

            $incident->update($validated);
            
        } catch (\Exception $e) {
            Log::error('Error updating incident report:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
        }
    }

    public function destroy($id)
    {
        $incident = IncidentReport::findOrFail($id);
        $incident->delete();
    }
}
