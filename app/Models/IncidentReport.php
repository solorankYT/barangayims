<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class IncidentReport extends Model
{

    protected $table = 'incident_reports';
    protected $primaryKey = 'id';
    protected $fillable = [
        'residentID',
        'title',
        'incidentType',
        'description',
        'status',
    ];

    public function resident()
    {
        return $this->belongsTo(User::class, 'residentID', 'id');
    }
}