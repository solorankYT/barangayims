import GuestLayout from '@/Layouts/GuestLayout';
import { Container, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import React, { useState, useEffect } from 'react';

const RequestStatus = () => {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        fetch('/api/requests') 
            .then(response => response.json())
            .then(data => setRequests(data))
            .catch(error => console.error("Error fetching requests:", error));
    }, []);

    return (
        <GuestLayout>
            <Container>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", mt: 10 }}>
                    <Typography variant="h4" gutterBottom>
                        Request Status
                    </Typography>

                    <TableContainer component={Paper} sx={{ mt: 3, maxWidth: "80%" }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Request Type</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {requests.length > 0 ? (
                                    requests.map((request) => (
                                        <TableRow key={request.id}>
                                            <TableCell>{request.id}</TableCell>
                                            <TableCell>{request.type}</TableCell>
                                            <TableCell>{request.status}</TableCell>
                                            <TableCell>{new Date(request.created_at).toLocaleDateString()}</TableCell>
                                            <TableCell>
                                                <Button variant="contained" color="primary">View</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center">No requests found</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Container>
        </GuestLayout>
    );
};

export default RequestStatus;
