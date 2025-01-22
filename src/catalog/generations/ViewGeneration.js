import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Masonry from 'react-masonry-css';
import '../../components/Masonry.css'

export default function ViewGeneration() {
    const [bodystyles, setBodystyles] = useState([]);
    const [facelifts, setFacelifts] = useState([]);
    const [generation, setGeneration] = useState({
        name: ''
    });

    const { make, model, generationId } = useParams();

    const [spots, setSpots] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const navigate = useNavigate();
    const { user } = useAuth();

    const breakpointColumnsObj = {
        default: 5,
        1100: 4,
        700: 3,
        500: 2
    };

    useEffect(() => {
        const loadData = async () => {
            await Promise.all([loadFacelifts(), loadBodystyles(), loadGeneration()]);
        };
        loadData();
        fetchSpots();
    }, []);

    const loadFacelifts = async () => {
        const result = await axios.get(`${process.env.REACT_APP_API_URL}/api/catalog/${make}/${model}/${generationId}/faceliftList`);
        setFacelifts(result.data);
    };

    const loadBodystyles = async () => {
        const result = await axios.get(`${process.env.REACT_APP_API_URL}/api/catalog/${make}/${model}/${generationId}/bodystyles`);
        setBodystyles(result.data);
    };

    const loadGeneration = async () => {
        const result = await axios.get(`${process.env.REACT_APP_API_URL}/api/catalog/${make}/${model}/${generationId}`);
        setGeneration(result.data);
    };

    const fetchSpots = async () => {
        try {
            const result = await axios.get(`${process.env.REACT_APP_API_URL}/api/spots/${generationId}/generationSpots?page=${page}&size=10`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
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

    return (
        <div>
            {user?.roles.includes("ROLE_ADMIN") && (
                <ul className="nav">
                    <Link className="nav-link active" aria-current="page" to={`/catalog/${make}/${model}/${generationId}/addFacelift`}>Add facelift</Link>
                    <Link className="nav-link active" aria-current="page" to={`/catalog/${make}/${model}/${generationId}/addBodystyle`}>Add bodystyle</Link>
                    <Link className="nav-link active" aria-current="page" to={`/catalog/${make}/${model}/${generationId}/editGeneration`}>Edit generation</Link>
                </ul>
            )}
            <div className='container'>
                <nav aria-label="breadcrumb" className='mt-3'>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/" className="text-decoration-none">Home</a></li>
                        <li className="breadcrumb-item"><a href="/catalog" className="text-decoration-none">Catalog</a></li>
                        <li className="breadcrumb-item"><a href={`/catalog/${make}`} className="text-decoration-none">{make}</a></li>
                        <li className="breadcrumb-item"><a href={`/catalog/${make}/${model}`} className="text-decoration-none">{model}</a></li>
                        <li className="breadcrumb-item active" aria-current="page">{generation.name}</li>
                    </ol>
                </nav>
                <div className="row row-cols-1 row-cols-md-3 mb-3">
                    <div className="col-md-3 mb-3 text-start">
                        <h5>{make} {model}</h5>
                        <h5>{generation.name}</h5>
                        <span>{generation?.years}</span>
                    </div>
                    <div className="col-md-9">
                        <p className="text-start">{generation?.description}</p>
                    </div>
                </div>
                {facelifts.map((facelift) => (
                    <div className="mt-3" key={facelift.id}>
                        <div className="h5 pb-1 text-black border-bottom border-muted text-start">
                            <div className="h5 col-md-5 text-start">
                                {facelift.name}
                                {user?.roles.includes("ROLE_ADMIN") && (
                                    <Link to={`/catalog/${make}/${model}/${generationId}/${facelift.id}/editFacelift`} className="ms-3 text-decoration-none">Edit facelift</Link>
                                )}
                            </div>
                        </div>

                        <div className="row row-cols-1 row-cols-md-3 g-3">
                            {bodystyles.filter(bodystyle => bodystyle.facelift.name === facelift.name).map((bodystyle) => (
                                <div className="col" key={bodystyle.id}>
                                    <Link to={`/catalog/${make}/${model}/${generationId}/${bodystyle.id}`} className="text-decoration-none text-black">
                                        <div className="card">
                                            <img
                                                src={`https://newloripinbucket.s3.amazonaws.com/image/catalog/${make || 'defaultMake'}/${model || 'defaultModel'}/${generation.name || 'defaultGeneration'}/${bodystyle.facelift.name}/${bodystyle.bodytype?.name || 'defaultBodystyle'}/${bodystyle?.photo?.name || 'defaultImage.jpg'}`}
                                                alt={bodystyle.name || "Default Image"}
                                                className="card-img-top"
                                            />
                                            <div className="card-body">
                                                <h5 className="card-title">
                                                    {bodystyle.bodytype?.name}
                                                </h5>
                                                <p className="card-text">{bodystyle.years}</p>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>

                    </div>
                ))}
                <div className="h5 pb-1 mb-3 mt-5 text-black border-bottom border-muted text-start">
                    Spots with {make} {model} {generation.name}
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
