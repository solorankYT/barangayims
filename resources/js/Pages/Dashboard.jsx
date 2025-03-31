import { usePage, Head } from "@inertiajs/react";
import { Grid, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { People, Place, Warning, Cloud } from '@mui/icons-material';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import axios from "axios";
import React, { useEffect, useState } from "react";

export default function Dashboard() {
    // ✅ Ensure props have default values to avoid errors
    const { residents = [], evacuationSites = [], incidents = [] } = usePage().props;
    const [weatherHistory, setWeatherHistory] = useState([]);
    const [currentWeather, setCurrentWeather] = useState(null);

    useEffect(() => {
        fetchWeatherHistory();
    }, []);

    const fetchWeatherHistory = async () => {
        try {
          const response = await axios.get("/fetchWeatherData");
          if (response.data) {
            const dataArray = Array.isArray(response.data) ? response.data : [response.data];
            setWeatherHistory(dataArray);
            
            // Set the latest weather data as the current weather
            if (dataArray.length > 0) {
              setCurrentWeather(dataArray[0]);
            }
          } else {
            console.error("Unexpected response format:", response.data);
          }
        } catch (error) {
          console.error("Error fetching weather history:", error);
        }
      };

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            {/* Dashboard Statistics */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                {/* Residents Count */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ borderLeft: '6px solid #2196f3', boxShadow: 2 }}>
                        <CardContent>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item>
                                    <People sx={{ fontSize: 40, color: '#2196f3' }} />
                                </Grid>
                                <Grid item>
                                    <Typography variant="h6">Total Residents</Typography>
                                    <Typography variant="h4">{residents.length}</Typography> {/* ✅ Use .length */}
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Evacuation Sites Count */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ borderLeft: '6px solid #4caf50', boxShadow: 2 }}>
                        <CardContent>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item>
                                    <Place sx={{ fontSize: 40, color: '#4caf50' }} />
                                </Grid>
                                <Grid item>
                                    <Typography variant="h6">Evacuation Sites</Typography>
                                    <Typography variant="h4">{evacuationSites.length}</Typography> {/* ✅ Use .length */}
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Active Incidents */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ borderLeft: '6px solid #f44336', boxShadow: 2 }}>
                        <CardContent>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item>
                                    <Warning sx={{ fontSize: 40, color: '#f44336' }} />
                                </Grid>
                                <Grid item>
                                    <Typography variant="h6">Active Incidents</Typography>
                                    <Typography variant="h4">{incidents.length}</Typography> {/* ✅ Use .length */}
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Main Dashboard Layout */}
            <Grid container spacing={3}>
                {/* Weather Widget */}
                        <Grid item xs={12} md={4}>
                        {currentWeather && (
                            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                <Cloud sx={{ verticalAlign: 'middle', mr: 1 }} />
                                Weather Update
                                </Typography>
                                <Typography variant="subtitle1">{currentWeather.city}, {currentWeather.country}</Typography>
                                <Typography variant="body2" color="textSecondary">{currentWeather.region}</Typography>
                                <div style={{ display: 'flex', alignItems: 'center', marginTop: 10 }}>
                                <img src={currentWeather.weather_icon} alt={currentWeather.weather_description} width="50" />
                                <div style={{ marginLeft: 10 }}>
                                    <Typography variant="h4">{currentWeather.temperature}°C</Typography>
                                    <Typography>{currentWeather.weather_description}</Typography>
                                </div>
                                </div>
                                <Typography variant="caption" color="textSecondary">Updated: {new Date(currentWeather.created_at).toLocaleString()}</Typography>
                            </CardContent>
                            </Card>
                        )}
                        </Grid>
                

                {/* Residents Table */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                        <CardContent>
                            <Typography variant="h6">Residents</Typography>
                            <TableContainer component={Paper} sx={{ minHeight: 30 }}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Name</TableCell>
                                            <TableCell>Contact Number</TableCell>
                                            <TableCell>Address</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {residents.length > 0 ? residents.map((resident, index) => ( /* ✅ Use .length */
                                            <TableRow key={index}>
                                                <TableCell>{resident.name}</TableCell>
                                                <TableCell>{resident.contact_number}</TableCell>
                                                <TableCell>{resident.address}</TableCell>
                                            </TableRow>
                                        )) : (
                                            <TableRow>
                                                <TableCell colSpan={3} align="center">No Residents Found</TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Evacuation Sites Table */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                        <CardContent>
                            <Typography variant="h6">Evacuation Sites</Typography>
                            <TableContainer component={Paper} sx={{ minHeight: 300 }}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Site Name</TableCell>
                                            <TableCell>Capacity</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {evacuationSites.length > 0 ? evacuationSites.map((site, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{site.site_name}</TableCell>
                                                <TableCell>{site.capacity}</TableCell>
                                            </TableRow>
                                        )) : (
                                            <TableRow>
                                                <TableCell colSpan={2} align="center">No Sites Available</TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </AuthenticatedLayout>
    );
}
