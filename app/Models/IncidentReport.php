<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class IncidentReport extends Model
{

    protected $table = 'incident_reports';
    protected $primaryKey = 'id';
    protected $fillable = [
        'resident_id',
        'title',
        'incident_type',
        'description',
        'status',
    ];

    public function resident()
    {
        return $this->belongsTo(User::class, 'resident_id', 'id');
    }
}