import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Masonry from 'react-masonry-css';
import '../../components/Masonry.css';

export default function ViewModel() {
    const [generations, setGenerations] = useState([]);
    const [modelDetails, setModelDetails] = useState(null);
    const { make, model } = useParams();
    const [spots, setSpots] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const { user } = useAuth();

    const breakpointColumnsObj = {
        default: 5,
        1100: 4,
        700: 3,
        500: 2,
    };

    useEffect(() => {
        setSpots([]);
        setPage(0);
        setHasMore(true);

        loadGenerations();
        loadModelDetails();
        fetchSpots(0);
    }, [make, model]);

    const loadGenerations = async () => {
        try {
            const result = await axios.get(`${process.env.REACT_APP_API_URL}/api/catalog/${make}/${model}`);
            setGenerations(result.data);
        } catch (error) {
            console.error("Error loading generations:", error);
        }
    };

    const loadModelDetails = async () => {
        try {
            const result = await axios.get(`${process.env.REACT_APP_API_URL}/api/catalog/${make}/${model}/editModel`);
            setModelDetails(result.data);
        } catch (error) {
            console.error('Error loading model details:', error);
        }
    };

    const fetchSpots = async (pageToFetch = 0) => {
        try {
            const result = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/catalog/${make}/${model}/modelSpots?page=${pageToFetch}&size=10`
            );
            const newSpots = result.data.content;

            setSpots((prevSpots) => {
                if (pageToFetch === 0) return newSpots;
                const filtered = newSpots.filter(
                    (newSpot) => !prevSpots.some((spot) => spot.id === newSpot.id)
                );
                return [...prevSpots, ...filtered];
            });

            setHasMore(result.data.totalPages > pageToFetch + 1);
        } catch (error) {
            console.error("Failed to fetch spots", error);
        }
    };

    const loadMoreSpots = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchSpots(nextPage);
    };

    return (
        <div>
            {user?.roles.includes("ROLE_ADMIN") && (
                <ul className="nav">
                    <Link className="nav-link active" to={`/catalog/${make}/${model}/addGeneration`}>
                        Add Generation
                    </Link>
                    <Link className="nav-link active" to={`/catalog/${make}/${model}/editModel`}>
                        Edit model
                    </Link>
                </ul>
            )}

            <div className='container'>
                <nav aria-label="breadcrumb" className='mt-3'>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/" className="text-decoration-none">Home</a></li>
                        <li className="breadcrumb-item"><a href="/catalog" className="text-decoration-none">Catalog</a></li>
                        <li className="breadcrumb-item"><a href={`/catalog/${make}`} className="text-decoration-none">{make}</a></li>
                        <li className="breadcrumb-item active" aria-current="page">{model}</li>
                    </ol>
                </nav>

                <div className="row row-cols-1 row-cols-md-3 mb-3 border-bottom border-muted">
                    <div className="col-md-3 mb-3 text-start">
                        <h5>{make} {model}</h5>
                        <span>{modelDetails?.years}</span>
                    </div>
                    <div className="col-md-9">
                        <p className="text-start">{modelDetails?.description}</p>
                    </div>
                </div>

                <div className="row row-cols-1 row-cols-md-3 g-3">
                    {generations
                        .slice()
                        .sort((a, b) => {
                            const getGenerationNumber = (name) => {
                                const match = name.match(/^(\d+)/); // ищем число в начале строки
                                return match ? parseInt(match[1]) : 0;
                            };
                            return getGenerationNumber(a.name) - getGenerationNumber(b.name);
                        })
                        .map((generation) => (
                            <div className="col" key={generation.id}>
                                <Link to={`/catalog/${make}/${model}/${generation.id}`} className="text-decoration-none text-black">
                                    <div className="card">
                                        <img
                                            src={
                                                generation?.photoName
                                                    ? `https://newloripinbucket.s3.amazonaws.com/image/spots/${generation.spotUser}/${generation.spotId}/${generation.photoName}`
                                                    : 'https://newloripinbucket.s3.amazonaws.com/image/placeholder_400x400.png'
                                            }
                                            className="card-img-top"
                                            alt={generation.name}
                                        />
                                        <div className="card-body">
                                            <h5 className="card-title">{generation.name}</h5>
                                            <p className="card-text">{generation.years}</p>
                                        </div>
                                        {generation.bodies?.length > 0 && (
                                            <div className='card-footer'>
                                                {generation.bodies.map((body, index) => (
                                                    <span key={body.id}>
                                                        {body.name}{index < generation.bodies.length - 1 && ', '}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            </div>
                        ))}
                </div>

                <div className="h5 pb-1 mb-3 mt-5 text-black border-bottom border-muted text-start">
                    Spots with {make} {model}
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
                                    alt={spot.photos?.find(photo => photo.isMain)?.name}
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
                            style={{ cursor: 'pointer', color: 'blue', fontSize: '16px' }}
                        >
                            Load More
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
