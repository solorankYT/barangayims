<?php

namespace App\Http\Controllers;

use App\Models\EvacuationSite;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class EvacuationSiteController extends Controller
{
    public function index()
    {
        $evacuationSites = EvacuationSite::all();

        return response()->json([
            'evacuationSites' => $evacuationSites,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        Log::info('Request Data: ', $request->all());
    
        $request->merge([
            'resources' => json_encode($request->resources)
        ]);
    
        $validatedData = $request->validate([
            'site_name' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'capacity' => 'required|integer|min:1',
            'status' => 'required|string|in:Active,Inactive,Full',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'contact_person' => 'nullable|string|max:255',
            'contact_number' => 'nullable|string|max:15',
            'resources' => 'nullable|string', 
            'link' => 'nullable|url',
        ]);
    
        $evacuationSite = EvacuationSite::create($validatedData);
    
        return response()->json($evacuationSite, 201);
    }
    
    public function update(Request $request, $id): JsonResponse
    {
        Log::info('Update Request Data: ', $request->all());

        $evacuationSite = EvacuationSite::findOrFail($id);

        $request->merge([
            'resources' => json_encode($request->resources)
        ]);

        $validatedData = $request->validate([
            'capacity' => 'required|integer|min:1',
            'status' => 'required|string|in:Active,Inactive,Full',
            'contact_person' => 'nullable|string|max:255',
            'contact_number' => 'nullable|string|max:15',
            'resources' => 'nullable|string',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'link' => 'nullable|url',

        ]);

        $evacuationSite->update($validatedData);

        return response()->json($evacuationSite, 200);
    }

    public function destroy($id): JsonResponse
    {
        $evacuationSite = EvacuationSite::findOrFail($id);
        $evacuationSite->delete();

        return response()->json(['message' => 'Evacuation site deleted successfully'], 200);
    }

}
