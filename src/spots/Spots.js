import { Link } from 'react-router-dom';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

export default function Spots() {
    const [spots, setSpots] = useState([]);

    const loadSpots = async () => {
        try {
            const result = await axios.get('http://localhost:8080/spots');
            setSpots(result.data);
        } catch (error) {
            console.error("Failed to fetch spots", error);
        }
    };

    useEffect(() => {
        loadSpots();
    }, []);

    return (
        <div>
            <ul className="nav">
                <li className="nav-item">
                    <Link className="nav-link active" aria-current="page" to='/spots/addSpot'>
                        Add Spot
                    </Link>
                </li>
            </ul>
            <div className="container">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <Link to="/" className="text-decoration-none">Home</Link>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">Spots</li>
                    </ol>
                </nav>
                <div className="row row-cols-1 row-cols-md-4 g-4">
                    {spots.map((spot) => (
                        <div className="col" key={spot.id}>
                            <div className="card h-100">
                                <Link to={`/spots/${spot.id}`}>
                                    <img
                                        src={`https://newloripinbucket.s3.amazonaws.com/image/spots/${spot?.photos[0]?.name || 'defaultImage.jpg'}`}
                                        className="card-img-top"
                                        alt={spot?.photos[0]?.name || 'Default Image'}
                                    />
                                </Link>
                                <div className="card-body">

                                    <p className="card-text text-start">Added by user</p>
                                </div>
                                <div className="card-footer">
                                    <small className="text-body-secondary text-start">Date</small>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
