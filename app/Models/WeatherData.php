<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WeatherData extends Model
{
    protected $table = 'weather_data';

    protected $fillable = [
        'city',
        'country',
        'region',
        'latitude',
        'longitude',
        'timezone',
        'localtime',
        'temperature',
        'weather_code',
        'weather_description',
        'weather_icon',
        'wind_speed',
        'wind_degree',
        'wind_dir',
        'pressure',
        'precip',
        'humidity',
        'cloudcover',
        'feels_like',
        'uv_index',
        'visibility',
    ];

    protected $casts = [
        'latitude' => 'float',
        'longitude' => 'float',
        'localtime' => 'datetime',
        'temperature' => 'integer',
        'weather_code' => 'integer',
        'wind_speed' => 'integer',
        'wind_degree' => 'integer',
        'pressure' => 'integer',
        'precip' => 'decimal:2',
        'humidity' => 'integer',
        'cloudcover' => 'integer',
        'feels_like' => 'integer',
        'uv_index' => 'integer',
        'visibility' => 'integer',
    ];
}
