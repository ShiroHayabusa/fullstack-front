import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext';
import Masonry from 'react-masonry-css';
import '../../components/Masonry.css'

export default function ViewBodystyle() {

    const [trims, setTrims] = useState([]);
    const [bodystyle, setBodystyle] = useState({
        name: '',
        generation: '',
        facelift: ''
    });

    const { make, model, generationId, bodystyleId } = useParams();

    const [spots, setSpots] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const { user } = useAuth();
    const [modelDetails, setModelDetails] = useState(null);

    const breakpointColumnsObj = {
        default: 5,
        1100: 4,
        700: 3,
        500: 2
    };

    useEffect(() => {
        loadTrims();
        fetchSpots();
        loadBodystyle();
        loadModelDetails();
    }, [user]);

    const loadModelDetails = async () => {
        try {
            const result = await axios.get(`${process.env.REACT_APP_API_URL}/api/catalog/${make}/${model}`);
            setModelDetails(result.data);
        } catch (error) {
            console.error('Error loading model details:', error);
        }
    };


    const loadTrims = async () => {
        const result = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/catalog/${make}/${model}/${generationId}/${bodystyleId}/listTrim`);
        setTrims(result.data);
    }

    const loadBodystyle = async () => {
        const result = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/catalog/${make}/${model}/${generationId}/${bodystyleId}`);
        setBodystyle(result.data);
    }

    const fetchSpots = async () => {
        try {
            const result = await axios.get(`${process.env.REACT_APP_API_URL}/api/spots/${bodystyleId}/bodystyleSpots?page=${page}&size=10`);
            setSpots((prevSpots) => {
                const newSpots = result.data.content.filter(
                    (newSpot) => !prevSpots.some((spot) => spot.id === newSpot.id)
                );
                return [...prevSpots, ...newSpots];
            });
            setHasMore(result.data.totalPages > page + 1);
        } catch (error) {
            console.error("Failed to fetch spots", error);
        }
    };

    const loadMoreSpots = () => {
        setPage((prevPage) => prevPage + 1);
    };

    useEffect(() => {
        if (page > 0) {
            fetchSpots();
        }
    }, [page]);

    const getRarityLabel = (productionCount) => {
        if (productionCount === 1) return { label: "Unique", color: "bg-danger text-white" };
        if (productionCount >= 2 && productionCount <= 10) return { label: "Ultra Exclusive", color: "bg-warning text-dark" };
        if (productionCount >= 11 && productionCount <= 50) return { label: "Super Exclusive", color: "bg-primary text-white" };
        if (productionCount >= 51 && productionCount <= 200) return { label: "Exclusive", color: "bg-success text-white" };
        if (productionCount >= 201 && productionCount <= 500) return { label: "Ultra Rare", color: "bg-info text-dark" };
        if (productionCount >= 501 && productionCount <= 1000) return { label: "Super Rare", color: "bg-secondary text-white" };
        if (productionCount >= 1001 && productionCount <= 5000) return { label: "Rare", color: "bg-dark text-white" };
        if (productionCount >= 5001 && productionCount <= 20000) return { label: "Semi-Mass Produced", color: "bg-light text-dark border" };
        if (productionCount >= 20001 && productionCount <= 100000) return { label: "Mass Produced", color: "bg-light text-dark border" };
        return { label: "Common", color: "bg-light text-dark border" }; // Default
    };

    const hasUserSpot = (trim) => {
        if (!user || !spots.length) return false;
        return spots.some(spot => spot.trim?.id === trim.id && spot.user?.username === user.username);
    };

    return (
        <div>
            {user?.roles.includes("ROLE_ADMIN") && (
                <ul className="nav">
                    <Link className="nav-link active" aria-current="page" to={`/catalog/${make}/${model}/${generationId}/${bodystyleId}/addTrim`}
                    >Add Trim</Link>
                    <Link className="nav-link active" aria-current="page" to={`/catalog/${make}/${model}/${generationId}/${bodystyleId}/editBodystyle`}
                    >Edit bodystyle</Link>
                </ul>
            )}
            <div className='container'>
                <nav aria-label="breadcrumb" className='mt-3'>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/" className="text-decoration-none">Home</a></li>
                        <li className="breadcrumb-item"><a href="/catalog" className="text-decoration-none">Catalog</a></li>
                        <li className="breadcrumb-item"><a href={`/catalog/${make}`} className="text-decoration-none">{make}</a></li>
                        <li className="breadcrumb-item"><a href={`/catalog/${make}/${model}`} className="text-decoration-none">{modelDetails?.name}</a></li>
                        <li className="breadcrumb-item"><a href={`/catalog/${make}/${model}/${bodystyle.generation.id}`} className="text-decoration-none">{bodystyle.generation.name}</a></li>
                        <li className="breadcrumb-item active" aria-current="page">{bodystyle.bodytype?.name}</li>
                    </ol>
                </nav>
                <div className="h5 pb-1 mb-3 text-black border-bottom border-muted text-start">
                    {make} {modelDetails?.name} {bodystyle.generation.name} {bodystyle.facelift.name} {bodystyle.bodytype?.name}
                </div>
                <div className="row row-cols-1 row-cols-sm-2">
                    <div className='col-md-8'>
                        {trims.map((trim, index) => {
                            const mainPhoto = Array.isArray(trim.photos) && trim.photos.length > 0
                                ? trim.photos.find((photo) => photo.isMain)
                                : {};

                            const rarity = getRarityLabel(trim.productionCount); // Get rarity label & color
                            const isUserSpot = hasUserSpot(trim); // Check if user has spot

                            return (
                                <Link
                                    to={`/catalog/${make}/${model}/${bodystyle.generation.id}/${bodystyleId}/${trim.id}`}
                                    className="text-decoration-none text-black"
                                    key={trim.id}>
                                    <div
                                        className="card mb-3"
                                        style={{
                                            border: isUserSpot ? "1px solid #14c609" : "1px solid #dee2e6",
                                        }}
                                        key={index}
                                    >
                                        <div className="row g-0">
                                            <div className="col-md-3 text-start">
                                                <img
                                                    src={`https://newloripinbucket.s3.amazonaws.com/image/spots/${trim.spotUser}/${trim.spotId}/${trim.photoName}`}
                                                    className="img-fluid"
                                                    alt=''
                                                    style={{ maxWidth: '100%', objectFit: 'cover' }}
                                                    onError={(e) => {
                                                        e.target.src = 'https://newloripinbucket.s3.amazonaws.com/image/placeholder_400x400.png'; // Placeholder image
                                                    }}
                                                />
                                            </div>
                                            <div className="col-md-9 text-start">
                                                <div className="card-body">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <h5 className="card-title">
                                                            {trim.name} {" "}
                                                        </h5>
                                                        <span className={`badge ${rarity.color}`} style={{ fontSize: "0.9em", padding: "5px 10px", borderRadius: "8px" }}>
                                                            {rarity.label}
                                                        </span>

                                                    </div>
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <p className="card-text">{trim.years}</p>
                                                        <span className="fw-light fs-5" style={{ fontSize: "0.9em", padding: "5px 10px", borderRadius: "8px" }}>
                                                            {trim?.market?.name}
                                                        </span>
                                                    </div>
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <p>{trim?.body?.name}</p>
                                                        {isUserSpot && (
                                                            <span style={{ color: "#14c609" }}>
                                                                <i className="bi bi-check-circle" style={{ marginRight: "5px", color: "#14c609" }}></i>
                                                                Spotted
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="card-text"><small className="text-body-secondary">{trim.hybrid}</small></p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}

                    </div>
                    <div className='col-md-4'>

                    </div>

                </div>
                <div className="h5 pb-1 mb-3 mt-5 text-black border-bottom border-muted text-start">
                    Spots with {make} {modelDetails?.name} {bodystyle.generation.name} {bodystyle.facelift.name} {bodystyle.bodytype?.name}
                </div>
                <div className="row row-cols-2 row-cols-md-5">
                    <Masonry
                        breakpointCols={breakpointColumnsObj}
                        className="my-masonry-grid"
                        columnClassName="my-masonry-grid_column"
                    >
                        {spots.map((spot) => (
                            <Link to={`/spots/${spot.id}`} key={spot.id}>
                                <img
                                    src={`https://newloripinbucket.s3.amazonaws.com/image/spots/${spot.user?.username}/${spot.id}/${spot.photos?.find(photo => photo.isMain)?.name}`}
                                    alt={spot.photos?.find(photo => photo.isMain).name}
                                    className="img-fluid mb-2"
                                />
                            </Link>
                        ))}
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
