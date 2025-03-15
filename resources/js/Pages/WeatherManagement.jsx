import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import { Grid } from "@mui/material";
import { Cloud } from "@mui/icons-material";
import axios from "axios";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function WeatherManagement() {
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

  const fetchCurrentWeather = async () => {
    try {
      await axios.get("/fetchAndStoreWeatherData");
      fetchWeatherHistory(); 
    } catch (error) {
      console.error("Error fetching current weather:", error);
    }
  };

  return (
    <AuthenticatedLayout header="Weather Management">
      <Box sx={{ width: "100%", padding: 3, }}>
        <Grid 
          container 
          spacing={2} 
          sx={{ 
            display: "flex", 
            justifyContent: "center",  
            alignItems: "center",    
          }}
        >
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
                  <Typography variant="caption" color="textSecondary">
                    Updated: {new Date(currentWeather.created_at).toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Grid>

          <Grid 
  item xs={12} md={4} 
  sx={{ 
    display: "flex", 
    flexDirection: { xs: "row", md: "column" }, // Side by side on small screens, stacked on large
    gap: 2, 
    alignItems: "center",
    justifyContent: "center" 
  }}
>
  <Box sx={{ display: "flex", width: "100%", gap: 2 }}>
    <Button 
      variant="contained" 
      color="primary" 
      onClick={fetchCurrentWeather} 
      sx={{ 
        maxWidth: 300, 
        width: "100%", 
        flex: 1,  // Make both buttons equal height
        minHeight: 50  // Ensures buttons don’t get too small
      }}
    >
      Fetch Current Weather
    </Button>

    <Button 
      variant="contained" 
      color="primary" 
      sx={{ 
        maxWidth: 300, 
        width: "100%", 
        flex: 1,  // Match height with other button
        minHeight: 50 
      }}
    >
      Send to Residents
    </Button>
  </Box>
          </Grid>

        </Grid>
        <Typography variant="h5" sx={{ mt: 4 }}>
          History
        </Typography>
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>Date</b></TableCell>
                <TableCell><b>Temperature (°C)</b></TableCell>
                <TableCell><b>Humidity (%)</b></TableCell>
                <TableCell><b>Weather</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {weatherHistory.length > 0 ? (
                weatherHistory.map((weather) => (
                  <TableRow key={weather.id}>
                    <TableCell>{new Date(weather.created_at).toLocaleString()}</TableCell>
                    <TableCell>{weather.temperature}</TableCell>
                    <TableCell>{weather.humidity}</TableCell>
                    <TableCell>{weather.weather_description}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No weather history available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </AuthenticatedLayout>
  );
}