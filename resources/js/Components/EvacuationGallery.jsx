import React, { useEffect, useState } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Grid,
  Modal,
  Box,
  Button,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
  Divider,
  useTheme,
  Paper
} from "@mui/material";
import {
  Place,
  People,
  Info,
  Close,
  Phone,
  AccessibilityNew,
  Directions
} from "@mui/icons-material";
import axios from "axios";

const EvacuationGallery = () => {
  const theme = useTheme();
  const [evacuationSites, setEvacuationSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedSite, setSelectedSite] = useState(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/fetchEvacuationSites");
        setEvacuationSites(response.data.evacuationSites || []);
      } catch (err) {
        console.error("Error fetching evacuation sites:", err);
        setError("Failed to load evacuation sites. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleOpen = (site) => {
    setSelectedSite(site);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedSite(null);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{ 
          fontWeight: 700,
          mb: 4,
          color: theme.palette.primary.dark
        }}
      >
        Evacuation Centers
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" my={8}>
          <CircularProgress size={60} />
        </Box>
      ) : error ? (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 4,
            "& .MuiAlert-message": { overflow: "hidden" }
          }}
        >
          {error}
          <Button 
            color="inherit" 
            size="small" 
            onClick={() => {
              setLoading(true);
              setError(null);
              axios.get("/fetchEvacuationSites")
                .then((response) => {
                  setEvacuationSites(response.data.evacuationSites || []);
                  setLoading(false);
                })
                .catch((err) => {
                  console.error("Retry failed:", err);
                  setError("Still unable to load data. Please check your connection.");
                  setLoading(false);
                });
            }}
            sx={{ ml: 2 }}
          >
            Retry
          </Button>
        </Alert>
      ) : (
        <Grid container spacing={4}>
          {evacuationSites.length > 0 ? (
            evacuationSites.map((site) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={site.id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: "12px",
                    boxShadow: theme.shadows[3],
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: theme.shadows[6]
                    }
                  }}
                >
                  <CardMedia
                    component="img"
                    image={
                      imageError || !site.link 
                        ? "/default-evacuation.jpg" 
                        : site.link
                    }
                    alt={site.site_name}
                    onError={handleImageError}
                    sx={{
                      height: 200,
                      objectFit: "cover",
                      borderTopLeftRadius: "12px",
                      borderTopRightRadius: "12px"
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography 
                      variant="h6" 
                      fontWeight={600}
                      gutterBottom
                      sx={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden"
                      }}
                    >
                      {site.site_name}
                    </Typography>
                    <Box display="flex" alignItems="center" mb={1}>
                      <Place 
                        fontSize="small" 
                        color="primary" 
                        sx={{ mr: 1 }} 
                      />
                      <Typography 
                        variant="body2"
                        sx={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden"
                        }}
                      >
                        {site.location}
                      </Typography>
                    </Box>
                    <Chip
                      icon={<People fontSize="small" />}
                      label={`Capacity: ${site.capacity}`}
                      size="small"
                      color="secondary"
                      sx={{ mr: 1, mb: 1 }}
                    />
                    {site.handicap_accessible && (
                      <Chip
                        icon={<AccessibilityNew fontSize="small" />}
                        label="ADA Accessible"
                        size="small"
                        color="success"
                      />
                    )}
                  </CardContent>
                  <Box sx={{ p: 2, pt: 0 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      color="primary"
                      startIcon={<Info />}
                      onClick={() => handleOpen(site)}
                    >
                      View Details
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))
          ) : (
            <Paper
              sx={{
                p: 4,
                textAlign: "center",
                width: "100%",
                backgroundColor: theme.palette.grey[100]
              }}
            >
              <Typography variant="h6" color="textSecondary">
                No evacuation centers available at this time
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Please check back later or contact barangay officials
              </Typography>
            </Paper>
          )}
        </Grid>
      )}

      {/* Details Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="evacuation-site-modal"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: "80%", md: "600px" },
            maxHeight: "90vh",
            bgcolor: "background.paper",
            boxShadow: theme.shadows[10],
            borderRadius: "16px",
            overflowY: "auto",
            outline: "none"
          }}
        >
          {selectedSite && (
            <>
              <Box sx={{ position: "relative" }}>
                <CardMedia
                  component="img"
                  image={
                    imageError || !selectedSite.link
                      ? "/default-evacuation.jpg"
                      : selectedSite.link
                  }
                  alt={selectedSite.site_name}
                  sx={{
                    width: "100%",
                    height: { xs: 200, sm: 300 },
                    objectFit: "cover",
                    borderTopLeftRadius: "16px",
                    borderTopRightRadius: "16px"
                  }}
                />
                <IconButton
                  onClick={handleClose}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    backgroundColor: "rgba(0,0,0,0.5)",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "rgba(0,0,0,0.7)"
                    }
                  }}
                >
                  <Close />
                </IconButton>
              </Box>

              <Box sx={{ p: 4 }}>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                  {selectedSite.site_name}
                </Typography>

                <Box display="flex" flexWrap="wrap" gap={1} mb={3}>
                  <Chip
                    icon={<People />}
                    label={`Capacity: ${selectedSite.capacity}`}
                    color="secondary"
                  />
                  {selectedSite.handicap_accessible && (
                    <Chip
                      icon={<AccessibilityNew />}
                      label="Wheelchair Accessible"
                      color="success"
                    />
                  )}
                  {selectedSite.contact_number && (
                    <Chip
                      icon={<Phone />}
                      label={`Contact: ${selectedSite.contact_number}`}
                      color="primary"
                    />
                  )}
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box mb={3}>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    <Place color="primary" sx={{ verticalAlign: "middle", mr: 1 }} />
                    Location
                  </Typography>
                  <Typography paragraph>{selectedSite.location}</Typography>
                  {selectedSite.directions && (
                    <>
                      <Typography variant="h6" fontWeight={600} gutterBottom>
                        Directions
                      </Typography>
                      <Typography paragraph>{selectedSite.directions}</Typography>
                    </>
                  )}
                </Box>

                {selectedSite.description && (
                  <Box mb={3}>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Description
                    </Typography>
                    <Typography paragraph>{selectedSite.description}</Typography>
                  </Box>
                )}

                <Box display="flex" flexWrap="wrap" gap={2} mt={4}>
                  {selectedSite.contact_number && (
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<Phone />}
                      href={`tel:${selectedSite.contact_number}`}
                    >
                      Call Center
                    </Button>
                  )}
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<Directions />}
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedSite.location)}`}
                    target="_blank"
                  >
                    Get Directions
                  </Button>
                </Box>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default EvacuationGallery;