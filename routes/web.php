<?php

use App\Http\Controllers\DocumentRequestController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ResidentController;
use App\Http\Controllers\IncidentReportController;

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


Route::get('/admincertificate', function () {
    return Inertia::render('AdminCertificate');
})->name('admincertificate');

Route::get('/requeststatus', function () {
    return Inertia::render('RequestStatus');
})->name('requeststatus');



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

Route::middleware('auth')->group(function () {
    Route::get('/incidentreport', [IncidentReportController::class, 'index'])->name('incidentreport');
    Route::post('/incidentreport', [IncidentReportController::class, 'store']);
    Route::put('/incidentreport/{id}', [IncidentReportController::class, 'update']);
    Route::delete('/incidentreport/{id}', [IncidentReportController::class, 'destroy']);
});

Route::middleware('auth')->group(function () {
    Route::get('AdminDocuments', [DocumentRequestController::class, 'index'])->name('AdminDocuments');
    Route::post('AdminDocuments', [DocumentRequestController::class, 'store']);
    Route::put('AdminDocuments/{id}', [DocumentRequestController::class, 'update']);
    Route::delete('AdminDocuments/{id}', [DocumentRequestController::class, 'destroy']);
});


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
