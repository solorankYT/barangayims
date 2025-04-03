import { usePage, Head, Link } from "@inertiajs/react";
import { 
  Grid, Card, CardContent, Typography, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, Paper, 
  Button, Box, Avatar, Divider, Chip 
} from '@mui/material';
import { People, Place, Warning, Cloud, Phone, Home, AccountTree } from '@mui/icons-material';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import axios from "axios";
import React, { useEffect, useState } from "react";

export default function Dashboard() {
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
        if (dataArray.length > 0) setCurrentWeather(dataArray[0]);
      }
    } catch (error) {
      console.error("Error fetching weather history:", error);
    }
  };

  return (
    <AuthenticatedLayout>
      <Head title="Dashboard" />

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ 
            height: '100%',
            borderLeft: '4px solid #1976d2',
            boxShadow: '0px 2px 10px rgba(0,0,0,0.08)',
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-4px)' }
          }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ 
                  bgcolor: '#e3f2fd', 
                  mr: 2,
                  width: 56, 
                  height: 56 
                }}>
                  <People sx={{ color: '#1976d2', fontSize: 30 }} />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">Total Residents</Typography>
                  <Typography variant="h4" fontWeight={600}>{residents.length}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ 
            height: '100%',
            borderLeft: '4px solid #388e3c',
            boxShadow: '0px 2px 10px rgba(0,0,0,0.08)'
          }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ 
                  bgcolor: '#e8f5e9', 
                  mr: 2,
                  width: 56, 
                  height: 56 
                }}>
                  <Place sx={{ color: '#388e3c', fontSize: 30 }} />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">Evacuation Sites</Typography>
                  <Typography variant="h4" fontWeight={600}>{evacuationSites.length}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ 
            height: '100%',
            borderLeft: '4px solid #d32f2f',
            boxShadow: '0px 2px 10px rgba(0,0,0,0.08)'
          }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ 
                  bgcolor: '#ffebee', 
                  mr: 2,
                  width: 56, 
                  height: 56 
                }}>
                  <Warning sx={{ color: '#d32f2f', fontSize: 30 }} />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">Active Incidents</Typography>
                  <Typography variant="h4" fontWeight={600}>{incidents.length}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Weather Widget */}
        <Grid item xs={12} md={4}>
          {currentWeather && (
            <Card sx={{ 
              borderRadius: 2,
              boxShadow: '0px 2px 10px rgba(0,0,0,0.08)',
              height: '100%'
            }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Cloud sx={{ color: '#0288d1', mr: 1 }} />
                  <Typography variant="h6" fontWeight={600}>Weather Update</Typography>
                </Box>
                
                <Box mb={2}>
                  <Typography variant="subtitle1" fontWeight={500}>
                    {currentWeather.city}, {currentWeather.country}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {currentWeather.region}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box display="flex" alignItems="center" mb={2}>
                  <Box mr={2}>
                    <img 
                      src={currentWeather.weather_icon} 
                      alt={currentWeather.weather_description} 
                      width="60" 
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

                <Typography variant="caption" color="textSecondary">
                  Updated: {new Date(currentWeather.created_at).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ 
            borderRadius: 2,
            boxShadow: '0px 2px 10px rgba(0,0,0,0.08)',
            height: '100%'
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <People sx={{ color: '#1976d2', mr: 1 }} />
                <Typography variant="h6" fontWeight={600}>Recent Residents</Typography>
              </Box>
              
              <TableContainer sx={{ maxHeight: 400 }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 600 }} align="right">Contact</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {residents.slice(0, 5).map((resident) => (
                      <TableRow key={resident.id} hover>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Avatar sx={{ 
                              width: 30, 
                              height: 30, 
                              mr: 1,
                              bgcolor: '#e3f2fd',
                              color: '#1976d2',
                              fontSize: 14
                            }}>
                              {resident.name.charAt(0)}
                            </Avatar>
                            {resident.name}
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Chip 
                            icon={<Phone sx={{ fontSize: 14 }} />}
                            label={resident.contact_number} 
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              {residents.length > 5 && (
                <Box mt={1} textAlign="right">
                  <Button size="small" color="primary" component={Link} href={route("residentmanagement")}>View All</Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ 
            borderRadius: 2,
            boxShadow: '0px 2px 10px rgba(0,0,0,0.08)',
            height: '100%'
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Place sx={{ color: '#388e3c', mr: 1 }} />
                <Typography variant="h6" fontWeight={600}>Evacuation Sites</Typography>
              </Box>
              
              <TableContainer sx={{ maxHeight: 400 }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Site Name</TableCell>
                      <TableCell sx={{ fontWeight: 600 }} align="right">Capacity</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {evacuationSites.map((site) => (
                      <TableRow key={site.id} hover>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <AccountTree sx={{ 
                              color: '#388e3c', 
                              mr: 1,
                              fontSize: 20 
                            }} />
                            {site.site_name}
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Chip 
                            label={`${site.capacity} people`} 
                            color="success"
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
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