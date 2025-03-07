import GuestLayout from '@/Layouts/GuestLayout';
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
        <div>
            <h2>Request Status</h2>
            <table>
                <thead>
                    <tr>
                        <th>Request Type</th>
                        <th>Reference No.</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map(req => (
                        <tr key={req.id}>
                            <td>{req.request_type}</td>
                            <td>{req.reference_no}</td>
                            <td>{req.created_at}</td>
                            <td>
                                <span className={`status ${req.status.toLowerCase()}`}>
                                    {req.status}
                                </span>
                            </td>
                            <td>
                                <button>View</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </GuestLayout>
    );
};

export default RequestStatus;
