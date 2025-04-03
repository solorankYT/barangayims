<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class CheckBarangayRole
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!Auth::check()) {
            Log::warning('Unauthenticated access attempt to barangay route', [
                'path' => $request->path(),
                'ip' => $request->ip()
            ]);
            return redirect('/');
        }

        $user = Auth::user();
        
        // Log all roles for debugging
        Log::debug('User roles check', [
            'user_id' => $user->id,
            'all_roles' => $user->getRoleNames(), // Spatie method
            'path' => $request->path()
        ]);

        // Check if user has either required role using Spatie
        if (!$user->hasAnyRole(['Barangay Captain', 'Barangay Secretary'])) {
            Log::warning('Unauthorized barangay role access attempt', [
                'user_id' => $user->id,
                'user_roles' => $user->getRoleNames()->toArray(),
                'required_roles' => ['Barangay Captain', 'Barangay Secretary'],
                'path' => $request->path()
            ]);
            return redirect('/');
        }

        Log::info('Barangay access granted', [
            'user_id' => $user->id,
            'role' => $user->getRoleNames(),
            'path' => $request->path()
        ]);

        return $next($request);
    }
}