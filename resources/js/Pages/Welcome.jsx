import React, { useState } from "react";
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
  useTheme
} from "@mui/material";
import { 
  Report, 
  Description, 
  WorkspacePremium,
  Email,
  Phone,
  LocationOn,
  Send,
  ArrowDownward
} from "@mui/icons-material";
import GuestLayout from "@/Layouts/GuestLayout";
import FileIncidentReport from "./FileIncidentReport";
import RequestDocuments from "./RequestDocuments";
import CertificateApplication from "./CertificateApplication";
import { Inertia } from "@inertiajs/inertia";
import EvacuationGallery from "@/Components/EvacuationGallery";
import EvacuationMap from "@/Components/EvacuationMap";

const Welcome = ({ auth }) => {
  const [openIncident, setOpenIncident] = useState(false);
  const [openDocument, setOpenDocument] = useState(false);
  const [openCertificate, setOpenCertificate] = useState(false);
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: "", 
    severity: "info" 
  });
  const theme = useTheme();

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