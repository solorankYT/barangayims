<?php

use App\Http\Controllers\DocumentRequestController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ResidentController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\RoleController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth'])->group(function () {
    Route::get('/document-requests', [DocumentRequestController::class, 'index']) ->name('admindocuments');
    Route::post('/document-requests', [DocumentRequestController::class, 'store']);
    Route::put('/document-requests/{id}', [DocumentRequestController::class, 'update']);
    Route::delete('/document-requests/{id}', [DocumentRequestController::class, 'destroy']);
});

Route::middleware('auth')->group(function () {
    Route::get('/roles', [RoleController::class, 'index'])->name('roles');
    Route::post('/roles', [RoleController::class, 'store']);
    Route::put('/roles/{role}', [RoleController::class, 'update']);
    Route::delete('/roles/{role}', [RoleController::class, 'destroy']);
});

Route::middleware('auth')->group(function () {
    Route::get('/residentmanagement', [ResidentController::class, 'index'])->name('residentmanagement');
    Route::post('/residentmanagement', [ResidentController::class, 'store']);
    Route::get('/residentmanagement/{id}', [ResidentController::class, 'show']);
    Route::put('/residentmanagement/{id}', [ResidentController::class, 'update']);
    Route::delete('/residentmanagement/{id}', [ResidentController::class, 'destroy']);
});


Route::get('/incidentreport', function () {
    return Inertia::render('IncidentReport');
})->middleware(['auth', 'verified'])->name('incidentreport');

Route::get('/admindocuments', function () {
    return Inertia::render('AdminDocuments');
})->middleware(['auth', 'verified'])->name('admindocuments');


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
