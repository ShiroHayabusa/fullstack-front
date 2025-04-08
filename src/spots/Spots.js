import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import Masonry from 'react-masonry-css';
import '../components/Masonry.css'

export default function Spots() {
    const [spots, setSpots] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [spotsPerPage] = useState(20);
    const { user } = useAuth();
    const navigate = useNavigate();

    const breakpointColumnsObj = {
        default: 4,
        1100: 3,
        700: 2,
        500: 1
    };

    const loadSpots = async () => {
        try {
            const result = await axios.get(`${process.env.REACT_APP_API_URL}/api/spots/mySpots`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            setSpots(result.data);
        } catch (error) {
            console.error("Failed to fetch spots", error);
        }
    };

    const toggleLike = async (spotId) => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/spots/${spotId}/like`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                }
            );

            console.log("API Response:", response.data);
            setSpots((prevSpots) =>
                prevSpots.map((spot) =>
                    spot.id === spotId
                        ? {
                            ...spot,
                            likeCount: response.data.likeCount,
                            hasLiked: response.data.hasLiked,
                        }
                        : spot
                )
            );
        } catch (error) {
            console.error("Error toggling like:", error);
        }
    };

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            loadSpots();
        }
    }, [user]);

    const indexOfLastSpot = currentPage * spotsPerPage;
    const indexOfFirstSpot = indexOfLastSpot - spotsPerPage;
    const currentSpots = spots.slice(indexOfFirstSpot, indexOfLastSpot);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div>
            <div className="container">
                <nav aria-label="breadcrumb" className='mt-3'>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <Link to="/" className="text-decoration-none">Home</Link>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">My spots</li>
                    </ol>
                </nav>
                <div className="row row-cols-1 row-cols-md-4 g-4">
                    <Masonry
                        breakpointCols={breakpointColumnsObj}
                        className="my-masonry-grid"
                        columnClassName="my-masonry-grid_column"
                    >
                        {currentSpots.map((spot) => {
                            const mainPhoto = Array.isArray(spot.photos) && spot.photos.length > 0
                                ? spot.photos.find((photo) => photo.isMain)
                                : {};

                            return (
                                <div className="col" key={spot.id}>
                                    <div className="card position-relative mb-3">
                                        <Link to={`/spots/${spot.id}`}>
                                            <img
                                                src={`https://newloripinbucket.s3.amazonaws.com/image/spots/${spot.user?.username}/${spot.id}/${mainPhoto?.name || 'defaultImage.jpg'}`}
                                                className="card-img-top"
                                                alt={spot?.photos[0]?.name || 'Default Image'}
                                            />
                                        </Link>
                                        <Link
                                            to={`/users/${spot.user?.id}`}
                                            className="position-absolute start-0 top-0 m-2 d-flex align-items-center text-decoration-none"
                                            style={{ padding: "5px", borderRadius: "5px" }}
                                        >
                                            {spot.user.avatar ? (
                                                <img
                                                    src={`https://newloripinbucket.s3.amazonaws.com/image/users/${spot.user.username}/${spot.user?.avatar}`}
                                                    alt="Avatar"
                                                    className="img-fluid rounded-circle me-2"
                                                    style={{ width: '30px', height: '30px', objectFit: 'cover' }}
                                                />
                                            ) : (
                                                <div
                                                    className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center me-2"
                                                    style={{ width: '30px', height: '30px', fontSize: '1rem' }}
                                                >
                                                    {spot.user?.username.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                            <span className="text-white">{spot.user.username}</span>
                                        </Link>
                                        <div className="card-footer">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div className="d-flex align-items-center">
                                                    <button
                                                        onClick={() => toggleLike(spot.id)}
                                                        className="btn btn-like p-0 me-2"
                                                    >
                                                        <i className={`bi ${spot.hasLiked ? 'bi-heart-fill text-danger' : 'bi-heart'}`}></i>
                                                    </button>
                                                    <span className="me-3">
                                                        {spot.likeCount}
                                                    </span>
                                                    <Link
                                                        to={`/spots/${spot.id}`}
                                                        className='text-decoration-none text-dark'
                                                    >
                                                        <i className="bi bi-chat me-1"></i>
                                                        <span>{spot.commentCount}</span>
                                                    </Link>
                                                </div>
                                                <span className="text-muted small">
                                                    {spot?.createdAt
                                                        ? `${formatDistanceToNow(new Date(spot.createdAt)).replace('about ', '')} ago`
                                                        : 'Unknown'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </Masonry>
                </div>

                <Pagination
                    spotsPerPage={spotsPerPage}
                    totalSpots={spots.length}
                    paginate={paginate}
                    currentPage={currentPage}
                />
            </div>
        </div>
    );
}

// Pagination component
function Pagination({ spotsPerPage, totalSpots, paginate, currentPage }) {
    const pageNumbers = [];
    const totalPages = Math.ceil(totalSpots / spotsPerPage);
    const maxVisiblePages = 5; // Maximum number of pages to display

    // Define the range of pages to display
    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    return (
        <nav className='mt-3'>
            <ul className="pagination justify-content-center" style={{ fontSize: '16px', fontWeight: '350', listStyleType: 'none', padding: 0 }}>

                {currentPage > 1 && (
                    <li className="page-item" style={{ margin: '0 5px' }}>
                        <span
                            onClick={() => paginate(1)}
                            style={{ cursor: 'pointer', color: 'blue' }}
                        >
                            First
                        </span>
                    </li>
                )}

                {currentPage > 1 && (
                    <li className="page-item" style={{ margin: '0 5px' }}>
                        <span
                            onClick={() => paginate(currentPage - 1)}
                            style={{ cursor: 'pointer', color: 'blue' }}
                        >
                            Prev
                        </span>
                    </li>
                )}

                {pageNumbers.map((number) => (
                    <li key={number} className="page-item" style={{ margin: '0 5px' }}>
                        <span
                            onClick={() => paginate(number)}
                            style={{
                                cursor: 'pointer',
                                color: number === currentPage ? 'red' : 'blue',
                                fontWeight: number === currentPage ? 'bold' : '400',
                            }}
                        >
                            {number}
                        </span>
                    </li>
                ))}

                {currentPage < totalPages && (
                    <li className="page-item" style={{ margin: '0 5px' }}>
                        <span
                            onClick={() => paginate(currentPage + 1)}
                            style={{ cursor: 'pointer', color: 'blue' }}
                        >
                            Next
                        </span>
                    </li>
                )}

                {currentPage < totalPages && (
                    <li className="page-item" style={{ margin: '0 5px' }}>
                        <span
                            onClick={() => paginate(totalPages)}
                            style={{ cursor: 'pointer', color: 'blue' }}
                        >
                            Last
                        </span>
                    </li>
                )}
            </ul>
        </nav>
    );
}




