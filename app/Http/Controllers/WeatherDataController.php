<?php

namespace App\Http\Controllers;
use App\Models\WeatherData;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WeatherDataController extends Controller
{
    public function fetchAndStoreWeatherData()
    {
        $apiKey = env('WEATHERSTACK_API_KEY'); 
        $url = "http://api.weatherstack.com/current?access_key={$apiKey}&query=14.621631587808366,121.02209348453395";
    
        $response = Http::get($url);

        if ($response->successful()) {
            $data = $response->json();
            Log::info($data);
            if (isset($data['location'], $data['current'])) {
                WeatherData::create([
                    'city' => $data['location']['name'],
                    'country' => $data['location']['country'],
                    'region' => $data['location']['region'],
                    'latitude' => $data['location']['lat'],
                    'longitude' => $data['location']['lon'],
                    'timezone' => $data['location']['timezone_id'],
                    'localtime' => $data['location']['localtime'],
                    'temperature' => $data['current']['temperature'],
                    'weather_code' => $data['current']['weather_code'],
                    'weather_description' => $data['current']['weather_descriptions'][0] ?? 'Unknown',
                    'weather_icon' => $data['current']['weather_icons'][0] ?? '',
                    'wind_speed' => $data['current']['wind_speed'],
                    'wind_degree' => $data['current']['wind_degree'],
                    'wind_dir' => $data['current']['wind_dir'],
                    'pressure' => $data['current']['pressure'],
                    'precip' => $data['current']['precip'],
                    'humidity' => $data['current']['humidity'],
                    'cloudcover' => $data['current']['cloudcover'],
                    'feels_like' => $data['current']['feelslike'],
                    'uv_index' => $data['current']['uv_index'],
                    'visibility' => $data['current']['visibility'],
                ]);

                return response()->json(['message' => 'Weather data saved successfully'], 200);
            }

            return response()->json(['error' => 'Invalid API response'], 500);
        }

        return response()->json(['error' => 'Failed to fetch weather data'], $response->status());
    }

    public function fetchCurrentWeather()
    {
        $weatherData = WeatherData::latest()->first();
        return response()->json($weatherData);
    }

    public function fetchWeatherData()
    {
        $weatherData = WeatherData::orderBy('created_at', 'desc')->get();
        return response()->json($weatherData);
    }
}
