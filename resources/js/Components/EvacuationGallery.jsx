import React, { useState } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Grid,
  Modal,
  Box,
  Button,
} from "@mui/material";

const evacuationSites = [
  {
    id: 1,
    name: "Evacuation Center A",
    location: "Barangay 137, Manila",
    capacity: "500 people",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyTvLH8qu8wiJiCu_qum1PiAGwJiWxSynWhQ&s",
    description: "This center has food, water, and first-aid facilities.",
  },
  {
    id: 2,
    name: "Evacuation Center B",
    location: "Barangay 220, Quezon City",
    capacity: "800 people",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4xJPGXEe2epBFpDNK-mG9E8OqD94Xd_snOQ&s",
    description: "Equipped with medical assistance and emergency supplies.",
  },
];

const EvacuationGallery = () => {
  const [open, setOpen] = useState(false);
  const [selectedSite, setSelectedSite] = useState(null);

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
      <Grid container spacing={3}>
        {evacuationSites.map((site) => (
          <Grid item xs={12} sm={6} md={4} key={site.id}>
            <Card sx={{ cursor: "pointer" }} onClick={() => handleOpen(site)}>
              <CardMedia
                component="img"
                height="200"
                image={site.image}
                alt={site.name}
              />
              <CardContent>
                <Typography variant="h6">{site.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {site.location}
                </Typography>
                <Typography variant="body2">Capacity: {site.capacity}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

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
                {selectedSite.name}
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
