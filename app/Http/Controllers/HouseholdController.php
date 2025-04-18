<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Household;

class HouseholdController extends Controller
{
    public function index()
    {
        $households = Household::all();

        return response()->json([
            'households' => $households,
        ]);
    }
}
