import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../components/ColumnContainer.css';
import '../../components/Masonry.css';

export default function AwardYears() {
    const [years, setYears] = useState([]);
    const [awardDetails, setAwardDetails] = useState(null);
    const { award } = useParams();
    const { user } = useAuth();

    useEffect(() => {
        loadAwardDetails();
        loadYears();
    }, [award]);

    const loadYears = async () => {
        const result = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/awards/${award}/years`);
        setYears(result.data);
    };

    const loadAwardDetails = async () => {
        try {
            const result = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/awards/${award}`);
            setAwardDetails(result.data);
        } catch (error) {
            console.error('Error loading award details:', error);
        }
    };

    return (
        <div>
            {user?.roles.includes("ROLE_ADMIN") && (
                <ul className="nav">
                    <Link className="nav-link active" to={`/admin/awards/${award}/addYear`}>Add Year</Link>
                </ul>
            )}
            <div className='container'>
                <div className="pb-1 mb-3 mt-1 text-black border-bottom d-flex justify-content-between align-items-center">
                    <nav aria-label="breadcrumb" className='mt-3'>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="/" className="text-decoration-none">Home</a></li>
                            <li className="breadcrumb-item"><a href="/admin/awards" className="text-decoration-none">Awards</a></li>
                            <li className="breadcrumb-item active" aria-current="page">{awardDetails?.name}</li>
                        </ol>
                    </nav>
                </div>

                <div className="card border-0 mb-3">
                    <div className="row g-0">
                        <div className="col-md-2 mb-3">
                            <img
                                src={`https://newloripinbucket.s3.amazonaws.com/image/awards/${awardDetails?.logo?.name}`}
                                style={{ width: '200px', height: 'auto' }}
                                alt={`${awardDetails?.name} logo`}
                                className='img-fluid mt-3'
                            />
                        </div>
                        <div className="col-md-5">
                            <div className="card-body">
                                <h3 className="card-title text-start">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        {awardDetails?.name}
                                    </div>
                                </h3>
                                <p className="card-text text-start">{awardDetails?.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col" className='text-start'>Year</th>
                            <th scope="col" className='text-start'>Winner</th>
                        </tr>
                    </thead>
                    <tbody className="table-group-divider">
                        {
                            years.map((year, index) => (
                                <tr key={year.id || index}>
                                    <td className='text-start fw-bold fs-5 align-middle'>
                                        {year.year}
                                    </td>
                                    <td className='text-start'>
                                        <Link to={`/catalog/${year.generation.make.name}/${year.generation.model.name}/${year.generation.id}`} className='text-decoration-none'>
                                            <img
                                                src={
                                                    year.generation?.photoName
                                                        ? `https://newloripinbucket.s3.amazonaws.com/image/spots/${year.generation.spotUser}/${year.generation.spotId}/${year.generation.photoName}`
                                                        : 'https://newloripinbucket.s3.amazonaws.com/image/placeholder_400x400.png'
                                                }
                                                className="img-fluid me-3"
                                                style={{ width: '100px', height: 'auto' }}
                                                alt={year.generation.name}
                                            />

                                            {year.generation?.make.name} {year.generation?.model.name}
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
}
