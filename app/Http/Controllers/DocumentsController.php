<?php

namespace App\Http\Controllers;

use App\Models\DocumentTypes;
use App\Models\Documents;
use App\Models\DocumentRequests;
use App\Models\User;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DocumentsController extends Controller
{
    public function getAllRequests()
    {
        $requests = DocumentRequests::with('user', 'documentType', 'document')->get();

        return Inertia::render('Documents/Requests', [
            'requests' => $requests,
        ]);
    }
}
