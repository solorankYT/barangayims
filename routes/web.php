<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DocumentRequestController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ResidentController;
use App\Http\Controllers\IncidentReportController;
use App\Http\Controllers\CertificateRequestsController;
use App\Http\Controllers\EvacuationSiteController;
use App\Http\Controllers\WeatherDataController;

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
})->name('welcome');


Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index']) ->name('dashboard');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/admincertificate', [CertificateRequestsController::class, 'index']) ->name('admincertificate');
    Route::post('/admincertificate', [CertificateRequestsController::class, 'store']);
    Route::put('/admincertificate/{id}', [CertificateRequestsController::class, 'update']);
    Route::delete('/admincertificate/{id}', [CertificateRequestsController::class, 'destroy']);
});

Route::get('/requeststatus', function () {
    return Inertia::render('RequestStatus');
})->name('requeststatus');


Route::get('/evacuationsitemanagement', function () {
    return Inertia::render('EvacuationSiteManagement');
})->name('evacuationsitemanagement');

Route::middleware(['auth'])->group(function () {
    Route::get('/evacuationSites', [EvacuationSiteController::class, 'index']) ;
    Route::post('/evacuationSites', [EvacuationSiteController::class, 'store']);
    Route::put('/evacuationSites/{id}', [EvacuationSiteController::class, 'update']);
    Route::delete('/evacuationSites/{id}', [EvacuationSiteController::class, 'destroy']);
});

Route::get('/fetchEvacuationSites', [EvacuationSiteController::class, 'fetchEvacuationSites']);

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

Route::get('/fetchAndStoreWeatherData', [WeatherDataController::class, 'fetchAndStoreWeatherData']);
Route::get('/fetchCurrentWeather', [WeatherDataController::class, 'fetchCurrentWeather']);
Route::get('/fetchWeatherData', [WeatherDataController::class, 'fetchWeatherData']);

Route::middleware('auth')->group(function () {
    Route::get('/weatherManagement', function () {
        return Inertia::render('WeatherManagement');
    })->name('WeatherManagement');

    Route::post('/weatherData', [WeatherDataController::class, 'store']);
    Route::put('/weatherData/{id}', [WeatherDataController::class, 'update']);
    Route::delete('/weatherData/{id}', [WeatherDataController::class, 'destroy']);
});

require __DIR__.'/auth.php';
