<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\ResidentFile;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Exception;

class ResidentFileController extends Controller
{
    public function serveValidID($fileName)
    {
        $filePath = "valid_ids/{$fileName}";
    
        if (!Storage::disk('resident_files')->exists($filePath)) {
            return response()->json(['message' => 'File not found'], 404);
        }
    
        $fullPath = Storage::disk('resident_files')->path($filePath);
    
        $mimeType = mime_content_type($fullPath);
    
        return response()->file($fullPath, [
            'Content-Type' => $mimeType,
            'Cache-Control' => 'no-store, no-cache, must-revalidate, max-age=0'
        ]);
    }
}
