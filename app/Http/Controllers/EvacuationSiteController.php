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

        return Inertia::render('EvacuationSiteList', [
            'evacuationSites' => $evacuationSites,
        ]);

        // return response()->json([
        //     'evacuationSites' => $evacuationSites,
        // ]);
    }
}
