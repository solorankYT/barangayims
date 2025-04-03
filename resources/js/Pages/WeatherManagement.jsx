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
  Grid,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  useTheme,
  IconButton,
  Tooltip
} from "@mui/material";
import {
  Cloud,
  Refresh,
  Send,
  History,
  Thermostat,
  WaterDrop,
  Visibility,
  Air
} from "@mui/icons-material";
import axios from "axios";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function WeatherManagement() {
  const theme = useTheme();
  const [weatherHistory, setWeatherHistory] = useState([]);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchWeatherHistory();
  }, []);

  const fetchWeatherHistory = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/fetchWeatherData");
      if (response.data) {
        const dataArray = Array.isArray(response.data) ? response.data : [response.data];
        setWeatherHistory(dataArray);
        
        if (dataArray.length > 0) {
          setCurrentWeather(dataArray[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching weather history:", error);
      setError("Failed to load weather data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentWeather = async () => {
    try {
      setLoading(true);
      setError(null);
      await axios.get("/fetchAndStoreWeatherData");
      await fetchWeatherHistory();
      setSuccess("Weather data updated successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error("Error fetching current weather:", error);
      setError("Failed to update weather data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const sendWeatherAlert = async () => {
    try {
      setLoading(true);
      await axios.post("/sendWeatherAlert", { weatherData: currentWeather });
      setSuccess("Weather alert sent to residents successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error("Error sending weather alert:", error);
      setError("Failed to send weather alert. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthenticatedLayout header="Weather Management">
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={5} lg={4}>
            <Card sx={{ 
              borderRadius: 2,
              boxShadow: theme.shadows[3],
              height: '100%'
            }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Cloud sx={{ 
                    color: theme.palette.primary.main, 
                    mr: 1,
                    fontSize: 30 
                  }} />
                  <Typography variant="h5" fontWeight={600}>
                    Current Weather
                  </Typography>
                  <Tooltip title="Refresh Data">
                    <IconButton
                      size="small"
                      onClick={fetchWeatherHistory}
                      sx={{ ml: 'auto' }}
                      disabled={loading}
                    >
                      <Refresh fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>

                {currentWeather ? (
                  <>
                    <Typography variant="h6" mb={1}>
                      {currentWeather.city}, {currentWeather.country}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                      {currentWeather.region}
                    </Typography>

                    <Box display="flex" alignItems="center" mb={3}>
                      <Box mr={2}>
                        <img 
                          src={currentWeather.weather_icon} 
                          alt={currentWeather.weather_description} 
                          width="60" 
                          onError={(e) => {
                            e.target.src = '/weather-icon-placeholder.png';
                          }}
                        />
                      </Box>
                      <Box>
                        <Typography variant="h3" fontWeight={700}>
                          {currentWeather.temperature}°C
                        </Typography>
                        <Typography variant="body1" textTransform="capitalize">
                          {currentWeather.weather_description}
                        </Typography>
                      </Box>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Box display="flex" alignItems="center">
                          <WaterDrop color="info" sx={{ mr: 1 }} />
                          <Typography>
                            Humidity: {currentWeather.humidity}%
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box display="flex" alignItems="center">
                          <Air color="info" sx={{ mr: 1 }} />
                          <Typography>
                            Wind: {currentWeather.wind_speed || 'N/A'} km/h
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box display="flex" alignItems="center">
                          <Visibility color="info" sx={{ mr: 1 }} />
                          <Typography>
                            Visibility: {currentWeather.visibility || 'N/A'} km
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box display="flex" alignItems="center">
                          <Thermostat color="info" sx={{ mr: 1 }} />
                          <Typography>
                            Feels like: {currentWeather.feels_like || currentWeather.temperature}°C
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>

                    <Typography variant="caption" color="text.secondary" mt={2} display="block">
                      Last updated: {new Date(currentWeather.created_at).toLocaleString()}
                    </Typography>
                  </>
                ) : (
                  <Typography color="text.secondary">
                    No current weather data available
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={7} lg={8}>
            <Card sx={{ 
              borderRadius: 2,
              boxShadow: theme.shadows[3],
              height: '100%'
            }}>
              <CardContent sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                height: '100%',
                justifyContent: 'center'
              }}>
                <Typography variant="h6" fontWeight={600} mb={3}>
                  Weather Actions
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      size="large"
                      startIcon={<Refresh />}
                      onClick={fetchCurrentWeather}
                      disabled={loading}
                      sx={{ py: 2 }}
                    >
                      {loading ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        "Fetch Current Weather"
                      )}
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="secondary"
                      size="large"
                      startIcon={<Send />}
                      onClick={sendWeatherAlert}
                      disabled={loading || !currentWeather}
                      sx={{ py: 2 }}
                    >
                      {loading ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        "Send Alert to Residents"
                      )}
                    </Button>
                  </Grid>
                </Grid>

                <Box mt={3}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Note:</strong> Weather alerts will be sent to all registered residents via SMS and email.
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Weather History Section */}
        <Card sx={{ 
          borderRadius: 2,
          boxShadow: theme.shadows[3]
        }}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={3}>
              <History sx={{ 
                color: theme.palette.primary.main, 
                mr: 1,
                fontSize: 30 
              }} />
              <Typography variant="h5" fontWeight={600}>
                Weather History
              </Typography>
            </Box>

            <TableContainer component={Paper} sx={{ borderRadius: 1 }}>
              <Table>
                <TableHead sx={{ bgcolor: theme.palette.grey[100] }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Date & Time</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="center">
                      <Box display="flex" alignItems="center" justifyContent="center">
                        <Thermostat sx={{ mr: 1 }} />
                        Temp (°C)
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="center">
                      <Box display="flex" alignItems="center" justifyContent="center">
                        <WaterDrop sx={{ mr: 1 }} />
                        Humidity (%)
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="center">Conditions</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="center">Wind (km/h)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {weatherHistory.length > 0 ? (
                    weatherHistory.map((weather) => (
                      <TableRow key={weather.id} hover>
                        <TableCell>
                          {new Date(weather.created_at).toLocaleString()}
                        </TableCell>
                        <TableCell align="center">{weather.temperature}</TableCell>
                        <TableCell align="center">{weather.humidity}</TableCell>
                        <TableCell align="center">
                          <Chip 
                            label={weather.weather_description} 
                            size="small"
                            sx={{ textTransform: 'capitalize' }}
                          />
                        </TableCell>
                        <TableCell align="center">{weather.wind_speed || 'N/A'}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                        {loading ? (
                          <CircularProgress />
                        ) : (
                          <Typography color="text.secondary">
                            No weather history available
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Container>
    </AuthenticatedLayout>
  );
}