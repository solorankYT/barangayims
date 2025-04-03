import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Button,
  Snackbar,
  Alert,
  Card,
  CardContent,
  CardActions,
  TextField,
  Grid,
  Divider,
  Chip,
  Paper,
  useTheme,
} from "@mui/material";
import { 
  Report, 
  Description, 
  WorkspacePremium,
  Email,
  Phone,
  LocationOn,
  Send,
  ArrowDownward,
  Cloud
} from "@mui/icons-material";
import GuestLayout from "@/Layouts/GuestLayout";
import FileIncidentReport from "./FileIncidentReport";
import RequestDocuments from "./RequestDocuments";
import CertificateApplication from "./CertificateApplication";
import { Inertia } from "@inertiajs/inertia";
import EvacuationGallery from "@/Components/EvacuationGallery";
import EvacuationMap from "@/Components/EvacuationMap";
import axios from "axios";

const Welcome = ({ auth }) => {
  const [openIncident, setOpenIncident] = useState(false);
  const [openDocument, setOpenDocument] = useState(false);
  const [openCertificate, setOpenCertificate] = useState(false);
  const [weatherHistory, setWeatherHistory] = useState([]);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: "", 
    severity: "info" 
  });
  const theme = useTheme();

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

  const handleButtonClick = (setter) => {
    if (!auth.user) {
      Inertia.visit(route("login"));
      setSnackbar({ 
        open: true, 
        message: "Please log in to access this feature", 
        severity: "warning" 
      });
      return;
    }
    setter(true);
  };

  const serviceCards = [
    { 
      title: "File Incident Report", 
      icon: <Report fontSize="large" />, 
      color: "error",
      action: setOpenIncident,
      description: "Report emergencies or community issues"
    },
    { 
      title: "Request Document", 
      icon: <Description fontSize="large" />, 
      color: "success",
      action: setOpenDocument,
      description: "Obtain barangay clearance or certifications"
    },
    { 
      title: "Request Certificate", 
      icon: <WorkspacePremium fontSize="large" />, 
      color: "primary",
      action: setOpenCertificate,
      description: "Apply for residency or good moral certificates"
    },
  ];

  return (
    <GuestLayout auth={auth}>
      <Box
        sx={{
          height: { xs: "60vh", md: "90vh" },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          backgroundImage: `
            linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.3)),
            url('https://plus.unsplash.com/premium_photo-1722704537052-04209596bf4e?q=80&w=2071&auto=format&fit=crop')
          `,
          backgroundSize: "cover",
          backgroundAttachment: { md: "fixed" },
          color: "white",
          px: { xs: 2, md: 4 },
          position: "relative"
        }}
      >
        <Container maxWidth="md">
          <Typography 
            variant="h2" 
            fontWeight={700} 
            gutterBottom 
            sx={{ 
              textShadow: "2px 2px 8px rgba(0,0,0,0.8)",
              [theme.breakpoints.down('sm')]: { fontSize: '2.5rem' }
            }}
          >
            Welcome to Barangay 137
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              color: theme.palette.warning.main,
              mb: 4,
              textShadow: "1px 1px 4px rgba(0,0,0,0.5)",
              [theme.breakpoints.down('sm')]: { fontSize: '1.2rem' }
            }}
          >
            Building a Stronger, Safer, and More Connected Community
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              onClick={() => document.getElementById("services").scrollIntoView({ behavior: "smooth" })}
              sx={{ px: 4, py: 1.5 }}
            >
              Explore Services
            </Button>
            {!auth.user && (
              <Button 
                variant="outlined" 
                color="inherit" 
                size="large"
                onClick={() => Inertia.visit(route("login"))}
                sx={{ 
                  px: 4, 
                  py: 1.5,
                  borderColor: 'white',
                  color: 'white',
                  '&:hover': { borderColor: 'white' }
                }}
              >
                Login
              </Button>
            )}
          </Box>
        </Container>
        
        <Box 
          sx={{ 
            position: 'absolute', 
            bottom: 40,
            animation: "bounce 2s infinite",
            "@keyframes bounce": {
              "0%, 100%": { transform: "translateY(0)" },
              "50%": { transform: "translateY(-10px)" }
            }
          }}
        >
          <ArrowDownward sx={{ fontSize: 40 }} />
        </Box>
      </Box>

      <Container id="services" sx={{ py: 8 }}>
        <Typography 
          variant="h3" 
          fontWeight={700} 
          textAlign="center" 
          gutterBottom
          sx={{ mb: 6 }}
        >
          Our Services
        </Typography>
        
        <Grid container spacing={4} justifyContent="center">
          {serviceCards.map((service, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: theme.shadows[8]
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', py: 4 }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      mx: 'auto',
                      mb: 3,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: theme.palette[service.color].light,
                      color: theme.palette[service.color].dark,
                      borderRadius: '50%'
                    }}
                  >
                    {service.icon}
                  </Box>
                  <Typography variant="h5" fontWeight={600} gutterBottom>
                    {service.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {service.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ p: 2 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    color={service.color}
                    size="large"
                    onClick={() => handleButtonClick(service.action)}
                    sx={{ py: 1.5 }}
                  >
                    Proceed
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Paper 
  id="weather" 
  sx={{ 
    py: 8,
    background: theme.palette.grey[50],
    borderRadius: 0,
    borderTop: `1px solid ${theme.palette.divider}`,
    borderBottom: `1px solid ${theme.palette.divider}`
  }}
>
  <Container>
    <Typography 
      variant="h3" 
      fontWeight={700} 
      textAlign="center" 
      gutterBottom
      sx={{ mb: 6 }}
    >
      Weather Updates
    </Typography>
    
    {currentWeather ? (
      <Grid container spacing={2}>
        <Grid item xs={12} md={4} lg={3}>
          <Card sx={{ 
            borderRadius: 3,
            boxShadow: theme.shadows[2],
            height: '100%',
            background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
            color: 'white',
            transition: 'transform 0.3s, box-shadow 0.3s',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: theme.shadows[6]
            }
          }}>
            <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box flexGrow={1}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                  <Box>
                    <Typography variant="h5" fontWeight={600} gutterBottom>
                      {currentWeather.city}
                    </Typography>
                    <Typography variant="body2">
                      {currentWeather.region}, {currentWeather.country}
                    </Typography>
                  </Box>
                  <Cloud sx={{ 
                    fontSize: 48, 
                    color: 'rgba(255,255,255,0.2)',
                    ml: 2 
                  }} />
                </Box>

                <Divider sx={{ 
                  my: 2, 
                  borderColor: 'rgba(255,255,255,0.2)' 
                }} />

                <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" textAlign="center">
                  <Box mb={2}>
                    <img 
                      src={currentWeather.weather_icon} 
                      alt={currentWeather.weather_description} 
                      width="80" 
                    />
                  </Box>
                  <Typography variant="h2" fontWeight={700}>
                    {currentWeather.temperature}°C
                  </Typography>
                  <Typography variant="h6" textTransform="capitalize">
                    {currentWeather.weather_description}
                  </Typography>
                </Box>
              </Box>

              <Box mt={3}>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Updated: {new Date(currentWeather.created_at).toLocaleTimeString()}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Weather Tips Section - 70% width */}
        <Grid item xs={12} md={8} lg={9}>
          <Card sx={{ 
            height: '100%',
            borderRadius: 3,
            boxShadow: theme.shadows[2],
            background: theme.palette.background.paper,
            transition: 'transform 0.3s, box-shadow 0.3s',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: theme.shadows[6]
            }
          }}>
            <CardContent sx={{ p: 4 }}>
              <Grid container spacing={4}>
                {/* Advisory Section - Top Half */}
                <Grid item xs={12} md={6}>
                  <Typography variant="h5" fontWeight={600} gutterBottom>
                    Current Advisory
                  </Typography>
                  <Box sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    mb: 3,
                    p: 3,
                    borderRadius: 2,
                    background: theme.palette.warning.light,
                    height: '100%'
                  }}>
                    <Box sx={{ 
                      width: 48, 
                      height: 48, 
                      borderRadius: '50%', 
                      backgroundColor: theme.palette.warning.main,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2,
                      color: 'white',
                      flexShrink: 0
                    }}>
                      <Typography variant="h6">!</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                        {currentWeather.temperature > 30 
                          ? "Heat Warning"
                          : currentWeather.weather_description.includes('rain') 
                            ? "Rain Advisory"
                            : "Weather Update"}
                      </Typography>
                      <Typography variant="body1">
                        {currentWeather.temperature > 30 
                          ? "Heat index reaching dangerous levels. Stay hydrated and avoid prolonged sun exposure."
                          : currentWeather.weather_description.includes('rain') 
                            ? "Rain expected in the area. Carry umbrellas and be cautious of slippery surfaces."
                            : "Normal weather conditions expected. No special precautions needed at this time."}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                {/* Emergency Contacts - Top Half */}
                <Grid item xs={12} md={6}>
                  <Typography variant="h5" fontWeight={600} gutterBottom>
                    Emergency Contacts
                  </Typography>
                  <Paper sx={{ p: 3, height: '100%' }}>
                    <Box component="ul" sx={{ pl: 2, listStyleType: 'none' }}>
                      <Box component="li" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                        <Phone color="error" sx={{ mr: 2 }} />
                        <Box>
                          <Typography fontWeight={500}>Barangay Hotline</Typography>
                          <Typography>0912 345 6789</Typography>
                        </Box>
                      </Box>
                      <Box component="li" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                        <Phone color="error" sx={{ mr: 2 }} />
                        <Box>
                          <Typography fontWeight={500}>NDRRMC Hotline</Typography>
                          <Typography>911-1406 / 912-2665</Typography>
                        </Box>
                      </Box>
                      <Box component="li" sx={{ display: 'flex', alignItems: 'center' }}>
                        <Phone color="error" sx={{ mr: 2 }} />
                        <Box>
                          <Typography fontWeight={500}>PAGASA Hotline</Typography>
                          <Typography>433-8526</Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>

                {/* Tips Section - Bottom Half */}
                <Grid item xs={12}>
                  <Typography variant="h5" fontWeight={600} gutterBottom padding={2}>
                    Preparedness Tips
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Paper sx={{ p: 2, height: '100%', textAlign: 'center' }}>
                        <Box sx={{ 
                          width: 60, 
                          height: 60, 
                          borderRadius: '50%', 
                          bgcolor: theme.palette.info.light,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mx: 'auto',
                          mb: 1
                        }}>
                          <Typography variant="h5" color="info.dark">1</Typography>
                        </Box>
                        <Typography variant="subtitle1" fontWeight={500}>Stay Informed</Typography>
                        <Typography variant="body2">
                          Monitor weather reports and barangay announcements regularly
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Paper sx={{ p: 2, height: '100%', textAlign: 'center' }}>
                        <Box sx={{ 
                          width: 60, 
                          height: 60, 
                          borderRadius: '50%', 
                          bgcolor: theme.palette.success.light,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mx: 'auto',
                          mb: 1
                        }}>
                          <Typography variant="h5" color="success.dark">2</Typography>
                        </Box>
                        <Typography variant="subtitle1" fontWeight={500}>Prepare Supplies</Typography>
                        <Typography variant="body2">
                          Maintain emergency kits with food, water, and first aid
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Paper sx={{ p: 2, height: '100%', textAlign: 'center' }}>
                        <Box sx={{ 
                          width: 60, 
                          height: 60, 
                          borderRadius: '50%', 
                          bgcolor: theme.palette.warning.light,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mx: 'auto',
                          mb: 1
                        }}>
                          <Typography variant="h5" color="warning.dark">3</Typography>
                        </Box>
                        <Typography variant="subtitle1" fontWeight={500}>Know Evacuation</Typography>
                        <Typography variant="body2">
                          Familiarize yourself with nearest evacuation centers
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Paper sx={{ p: 2, height: '100%', textAlign: 'center' }}>
                        <Box sx={{ 
                          width: 60, 
                          height: 60, 
                          borderRadius: '50%', 
                          bgcolor: theme.palette.error.light,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mx: 'auto',
                          mb: 1
                        }}>
                          <Typography variant="h5" color="error.dark">4</Typography>
                        </Box>
                        <Typography variant="subtitle1" fontWeight={500}>Emergency Plan</Typography>
                        <Typography variant="body2">
                          Establish family communication and meeting plans
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              <Button 
                variant="contained" 
                color="primary" 
                fullWidth 
                size="large"
                sx={{ mt: 4 }}
                onClick={() => window.open('https://www.pagasa.dost.gov.ph/', '_blank')}
                startIcon={<Cloud />}
              >
                View Detailed Weather Forecast
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    ) : (
      <Box textAlign="center" py={4}>
        <Typography variant="body1" color="text.secondary">
          Loading weather data...
        </Typography>
      </Box>
    )}
  </Container>
</Paper>
    
      <Paper 
        id="evacuation" 
        sx={{ 
          py: 8,
          background: theme.palette.grey[100],
          borderRadius: 0
        }}
      >
        <Container>
          <Typography variant="h3" fontWeight={700} textAlign="center" gutterBottom>
            Emergency Preparedness
          </Typography>
          <Typography 
            variant="body1" 
            textAlign="center" 
            sx={{ maxWidth: 700, mx: 'auto', mb: 6 }}
          >
            Know your evacuation sites and safety procedures in case of emergencies
          </Typography>
          
          <Box sx={{ mb: 6 }}>
            <EvacuationGallery />
          </Box>
          
          <Box>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Evacuation Map
            </Typography>
            <EvacuationMap />
          </Box>
        </Container>
      </Paper>

      <Container id="about" sx={{ py: 8 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography 
              variant="h3" 
              fontWeight={700} 
              gutterBottom
            >
              About Our Barangay
            </Typography>
            <Typography variant="body1" paragraph>
              Barangay 137 in Caloocan City is committed to serving its residents with integrity 
              and dedication. Our mission is to foster a safe, clean, and progressive community.
            </Typography>
            <Typography variant="body1" paragraph>
              We provide essential services including document processing, community programs, 
              and emergency response to ensure the welfare of all residents.
            </Typography>
            <Box sx={{ mt: 3 }}>
              <Chip 
                label="24/7 Emergency Hotline" 
                color="error" 
                icon={<Phone />}
                sx={{ mr: 1, mb: 1 }}
              />
              <Chip 
                label="Community Center" 
                color="primary" 
                icon={<LocationOn />}
                sx={{ mr: 1, mb: 1 }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ba?q=80&w=2070&auto=format&fit=crop"
              alt="Barangay Center"
              sx={{
                width: '100%',
                borderRadius: 2,
                boxShadow: theme.shadows[4]
              }}
            />
          </Grid>
        </Grid>
      </Container>

      {/* ========== CONTACT SECTION ========== */}
      <Paper 
        id="contact" 
        sx={{ 
          py: 8,
          background: theme.palette.primary.dark,
          color: 'white',
          borderRadius: 0
        }}
      >
        <Container>
          <Typography variant="h3" fontWeight={700} textAlign="center" gutterBottom>
            Contact Us
          </Typography>
          
          <Grid container spacing={6} sx={{ mt: 4 }}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationOn sx={{ mr: 2, fontSize: 30 }} />
                  <Box>
                    <Typography variant="h6" fontWeight={600}>Address</Typography>
                    <Typography>Barangay 137, Zone 12, District 1, Caloocan City</Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Phone sx={{ mr: 2, fontSize: 30 }} />
                  <Box>
                    <Typography variant="h6" fontWeight={600}>Phone</Typography>
                    <Typography>0912 345 6789 (Emergency)</Typography>
                    <Typography>02 8123 4567 (Office)</Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Email sx={{ mr: 2, fontSize: 30 }} />
                  <Box>
                    <Typography variant="h6" fontWeight={600}>Email</Typography>
                    <Typography>barangay137@caloocan.gov.ph</Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h5" fontWeight={600} mb={3}>
                  Send Us a Message
                </Typography>
                <form>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField 
                        label="Your Name" 
                        variant="outlined" 
                        fullWidth 
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField 
                        label="Your Email" 
                        type="email" 
                        variant="outlined" 
                        fullWidth 
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField 
                        label="Your Message" 
                        variant="outlined" 
                        fullWidth 
                        multiline 
                        rows={4} 
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button 
                        variant="contained" 
                        color="primary" 
                        fullWidth 
                        size="large"
                        endIcon={<Send />}
                      >
                        Submit
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Paper>

      {/* ========== MODALS ========== */}
      {auth.user && (
        <>
          <FileIncidentReport open={openIncident} handleClose={() => setOpenIncident(false)} />
          <RequestDocuments open={openDocument} handleClose={() => setOpenDocument(false)} />
          <CertificateApplication open={openCertificate} handleClose={() => setOpenCertificate(false)} />
        </>
      )}

      {/* ========== SNACKBAR ========== */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </GuestLayout>
  );
};

export default Welcome;