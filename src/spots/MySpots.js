import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import Masonry from 'react-masonry-css';
import '../components/Masonry.css'
import { Tooltip } from "bootstrap";

export default function MySpots() {
    const [spots, setSpots] = useState([]);
    const { user } = useAuth();
    const navigate = useNavigate();
    const tooltipRefs = useRef({});
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);


    const breakpointColumnsObj = {
        default: 4,
        1100: 3,
        700: 2,
        500: 1
    };

    const loadSpots = async (pageToLoad) => {
        try {
            const result = await axios.get(`${process.env.REACT_APP_API_URL}/api/spots/mySpots?page=${pageToLoad}&size=12`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            setSpots((prevSpots) => {
                const newSpots = (result.data?.content ?? []).filter(
                    (newSpot) => !prevSpots.some((spot) => spot.id === newSpot.id)
                );
                return [...prevSpots, ...newSpots];
            });
            setHasMore(result.data.totalPages > pageToLoad + 1);
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

    const loadMoreSpots = () => {
        setPage((prevPage) => prevPage + 1);
    };

    useEffect(() => {
        loadSpots(page);
    }, [page]);

    useEffect(() => {
        Object.values(tooltipRefs.current).forEach((element) => {
            if (element) {
                const tooltip = new Tooltip(element, {
                    trigger: "hover click",
                    placement: "bottom",
                });
                setTimeout(() => {
                    tooltip.dispose();
                }, 2000);
            }
        });
        return () => {
            Object.values(tooltipRefs.current).forEach((element) => {
                if (element && element._tooltip) {
                    element._tooltip.dispose();
                }
            });
        };
    }, [spots]);

    return (
        <div>
            <div className="container">
                {user?.token ? (
                    <ul className="nav" style={{ display: "flex", alignItems: "center" }}>
                        <li className="nav-item">
                            <button
                                className="btn btn-outline-primary mt-3"
                                onClick={() => navigate(`/spots/addSpot`)}
                            >
                                Add Spot
                            </button>
                        </li>
                    </ul>
                ) : null}
                <nav aria-label="breadcrumb" className='mt-3'>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <Link to="/" className="text-decoration-none">Home</Link>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">My spots</li>
                    </ol>
                </nav>
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-4">
                    <Masonry
                        breakpointCols={breakpointColumnsObj}
                        className="my-masonry-grid"
                        columnClassName="my-masonry-grid_column"
                    >
                        {spots.map((spot) => {
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
                                                    src={`https://newloripinbucket.s3.amazonaws.com/image/users/${spot.user.username}/${spot.user?.avatar.name}`}
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
                                        {spot.trim && (
                                            <div className="position-absolute end-0 top-0 m-2 d-flex align-items-center">
                                                <i
                                                    ref={(el) => (tooltipRefs.current[spot.id] = el)}
                                                    className="bi bi-check-circle fs-5"
                                                    style={{
                                                        marginRight: "5px",
                                                        marginTop: "5px",
                                                        color: "#14c609",
                                                        fontWeight: "bold",
                                                        textShadow: "1px 1px 1px black",
                                                        cursor: "pointer"
                                                    }}
                                                    data-bs-toggle="tooltip"
                                                    data-bs-placement="bottom"
                                                    title="Identified"
                                                    data-bs-trigger="hover click"
                                                ></i>
                                            </div>
                                        )}

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
                {hasMore && (
                    <div className="text-center mt-3">
                        <span
                            onClick={loadMoreSpots}
                            style={{
                                cursor: 'pointer',
                                color: 'blue',
                                fontSize: '16px',
                            }}
                        >
                            Load More
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}





