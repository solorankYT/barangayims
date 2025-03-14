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
  Alert
} from "@mui/material";
import axios from "axios";

const EvacuationGallery = () => {
  const [evacuationSites, setEvacuationSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedSite, setSelectedSite] = useState(null);

  // Fetch evacuation site data from the database
  useEffect(() => {
    axios.get("/evacuationSites")
      .then((response) => {
        setEvacuationSites(response.data.evacuationSites || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching evacuation sites:", err);
        setError("Failed to load evacuation sites.");
        setLoading(false);
      });
  }, []);

  const handleOpen = (site) => {
    setSelectedSite(site);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedSite(null);
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Evacuation Centers
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Grid container spacing={3}>
          {evacuationSites.length > 0 ? (
            evacuationSites.map((site) => (
              <Grid item xs={12} sm={6} md={4} key={site.id}>
            <Card 
                sx={{ 
                  cursor: "pointer", 
                  maxWidth: 300, 
                  borderRadius: "10px", 
                  boxShadow: 3, 
                  "&:hover": { boxShadow: 6 } 
                  
                }} 
                onClick={() => handleOpen(site)}
              >
                <CardMedia
                  component="img"
                  image={site.link || "/default-evacuation.jpg"}
                  alt={site.site_name}
                  sx={{
                    width: "100%",
                    height: "250px", 
                    objectFit: "fill"
                  }}
                />
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">
                    {site.site_name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {site.location}
                  </Typography>
                  <Typography variant="body2" fontWeight="500">
                    Capacity: {site.capacity}
                  </Typography>
                </CardContent>
              </Card>

              </Grid>
            ))
          ) : (
            <Typography variant="body1" color="textSecondary">
              No evacuation centers available.
            </Typography>
          )}
        </Grid>
      )}

      {/* Modal for Additional Details */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            p: 4,
            boxShadow: 24,
            borderRadius: 2,
          }}
        >
          {selectedSite && (
            <>
              <Typography variant="h5" gutterBottom>
                {selectedSite.site_name}
              </Typography>
              <Typography variant="body1">{selectedSite.description}</Typography>
              <Typography variant="body2" sx={{ mt: 2, color: "textSecondary" }}>
                Location: {selectedSite.location}
              </Typography>
              <Typography variant="body2">Capacity: {selectedSite.capacity}</Typography>
              <Button onClick={handleClose} sx={{ mt: 2 }} variant="contained">
                Close
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default EvacuationGallery;
