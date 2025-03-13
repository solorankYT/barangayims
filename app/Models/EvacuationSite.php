<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EvacuationSite extends Model
{
    protected $table = 'evacuation_sites';

    protected $fillable = [
        'site_name',
        'location',
        'capacity',
        'status',
        'resources',
        'contact_person',
        'contact_number',
        'latitude',
        'longitude',
    ];

    protected $casts = [
        'resources' => 'array', 
    ];
}
