import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function Dashboard() {
    const [weather, setWeather] = useState(null);

    useEffect(() => {
        fetch('/weatherData')
            .then(response => response.json())
            .then(data => setWeather(data))
            .catch(error => console.error('Error fetching weather data:', error));
    }, []);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white border border-gray-600 shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {weather ? (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">
                                        {weather.city}, {weather.country}
                                    </h3>
                                    <p className="text-sm text-gray-500">{weather.region}</p>
                                    <div className="flex items-center">
                                        <img src={weather.weather_icon} alt={weather.weather_description} className="w-16 h-16" />
                                        <div className="ml-4">
                                            <p className="text-2xl font-bold">{weather.temperature}°C</p>
                                            <p className="text-gray-600">{weather.weather_description}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-gray-700">
                                        <p><strong>Feels Like:</strong> {weather.feels_like}°C</p>
                                        <p><strong>Humidity:</strong> {weather.humidity}%</p>
                                        <p><strong>Wind Speed:</strong> {weather.wind_speed} km/h</p>
                                        <p><strong>Wind Direction:</strong> {weather.wind_dir}</p>
                                        <p><strong>Pressure:</strong> {weather.pressure} hPa</p>
                                        <p><strong>Visibility:</strong> {weather.visibility} km</p>
                                        <p><strong>Cloud Cover:</strong> {weather.cloudcover}%</p>
                                        <p><strong>UV Index:</strong> {weather.uv_index}</p>
                                    </div>
                                    <p className="text-xs text-gray-500">Last updated: {new Date(weather.updated_at).toLocaleString()}</p>
                                </div>
                            ) : (
                                <p>Loading weather data...</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
