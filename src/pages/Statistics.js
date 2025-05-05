import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Statistics() {

    const { user } = useAuth();
    const [stats, setStats] = useState({
        spots: 0,
        comments: 0,
    });

    const loadStatistics = async () => {
        if (!user || !user.token) return;

        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/statistics`
            );
            setStats(response.data);
        } catch (error) {
            console.error("Failed to fetch user stats:", error);
        }
    };

    useEffect(() => {
        loadStatistics();
    }, []);

    return (
        <div>
            <div className='container'>
                <nav aria-label="breadcrumb" className='mt-3'>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/" className="text-decoration-none">Home</a></li>
                        <li className="breadcrumb-item active" aria-current="page">Statistics</li>
                    </ol>
                </nav>
                <div className="col-md-3 text-start mb-3">
                    <p>Spots: {stats.spots}</p>
                    <p>Makes: {stats.makes}</p>
                    <p>Models: {stats.models}</p>
                    <p>Cars: {stats.trims}</p>
                    <p>Users: {stats.users}</p>
                </div>
            </div>
        </div>

    )
}
