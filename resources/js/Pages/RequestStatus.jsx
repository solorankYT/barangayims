import GuestLayout from '@/Layouts/GuestLayout';
import { Container, Box, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';

const RequestStatus = () => {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        fetch('/api/requests') // Fetch data from Laravel API
            .then(response => response.json())
            .then(data => setRequests(data));
    }, []);

    return (
        <GuestLayout>
            <Container>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", mt: 10 }}>
                    <Typography variant="h4" gutterBottom>
                        Request Status
                    </Typography>
                </Box>
            </Container>
        </GuestLayout>
    );
};

export default RequestStatus;
