import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import L from "leaflet";
import { Dialog, DialogTitle, DialogContent, Typography, CardMedia } from "@mui/material";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

const center = [14.62086, 121.06221]; 

const EvacuationMap = () => {
    const [sites, setSites] = useState([]);
    const [selectedSite, setSelectedSite] = useState(null); 

    useEffect(() => {
        fetch("/fetchEvacuationSites")
            .then((response) => response.json())
            .then((data) => setSites(data.evacuationSites || [])) 
            .catch((error) => console.error("Error fetching sites:", error));
    }, []);

    return (
        <div style={{ height: "500px", width: "100%" }}>
            <MapContainer center={center} zoom={12} style={{ height: "100%", width: "100%" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {sites.map((site) => (
                    <Marker key={site.id} position={[site.latitude, site.longitude]}
                        eventHandlers={{ click: () => setSelectedSite(site) }}>
                        <Popup>
                            <Typography variant="body1"><strong>{site.site_name}</strong></Typography> {/* ✅ Fix */}
                            <Typography variant="body2">{site.location}</Typography>
                            <Typography variant="caption">Click for more info</Typography>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            <Dialog open={!!selectedSite} onClose={() => setSelectedSite(null)}>
                {selectedSite && (
                    <>
                        <DialogTitle>{selectedSite.name}</DialogTitle>
                        <DialogContent>
                            {selectedSite.image && (
                                <CardMedia component="img" height="200" image={`/storage/${selectedSite.image}`} alt={selectedSite.name} />
                            )}
                            <Typography variant="body1">{selectedSite.description}</Typography>
                            <Typography variant="body2"><strong>Location:</strong> {selectedSite.location}</Typography>
                            <Typography variant="body2"><strong>Capacity:</strong> {selectedSite.capacity} people</Typography>
                        </DialogContent>
                    </>
                )}
            </Dialog>
        </div>
    );
};

export default EvacuationMap;
