<?php

namespace App\Http\Controllers;

use App\Models\EvacuationSite;
use App\Models\IncidentReport;
use App\Models\User;
use App\Models\WeatherData;
use Inertia\Inertia;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
   


public function index() {
    return Inertia::render('Dashboard', [
        'weather' => WeatherData::all(),
        'residents' => User::all(),
        'evacuationSites' => EvacuationSite::where('status', 'Active') -> get(),
        'incidents' => IncidentReport::where('status', 'Ongoing')->get()
    ]);
}
}
