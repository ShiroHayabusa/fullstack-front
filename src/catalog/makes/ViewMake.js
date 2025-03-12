import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext';
import '../../components/ColumnContainer.css'
import Grid from '../../components/Grid';
import Masonry from 'react-masonry-css';
import '../../components/Masonry.css'

export default function ViewMake() {

    const [models, setModels] = useState([]);
    const [makeDetails, setMakeDetails] = useState(null);
    const { make } = useParams();
    const [spots, setSpots] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const { user } = useAuth();
    const [trims, setTrims] = useState([]);
    const [spotsWithoutPage, setSpotsWithoutPage] = useState([]);
    const [totalCells, setTotalCells] = useState(null);

    const breakpointColumnsObj = {
        default: 5,
        1100: 4,
        700: 3,
        500: 2
    };

    useEffect(() => {
        loadModels();
        loadMakeDetails();
        fetchSpots();
    }, []);


    const loadModels = async () => {
        const result = await axios.get(`${process.env.REACT_APP_API_URL}/api/catalog/${make}`);
        setModels(result.data);
    }

    const loadMakeDetails = async () => {
        try {
            const result = await axios.get(`${process.env.REACT_APP_API_URL}/api/catalog/editMake/${make}`);
            setMakeDetails(result.data);
        } catch (error) {
            console.error('Error loading make details:', error);
        }
    };

    const fetchTrims = async () => {
        try {
            const result = await axios.get(`${process.env.REACT_APP_API_URL}/api/catalog/${make}/trims`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            setTrims(result.data);
            setTotalCells(result.data.length);
        } catch (error) {
            console.error("Error fetching trims", error);
        }
    };

    const fetchSpotsWithoutPage = async () => {
        try {
            const result = await axios.get(`${process.env.REACT_APP_API_URL}/api/spots/${make}/user`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            setSpotsWithoutPage(result.data);
        } catch (error) {
            console.error("Error fetching spots", error);
        }
    };

    const matchingCount = trims.filter(trim =>
        spotsWithoutPage.some(spot =>
            spot.trim && spot.trim.id === trim.id
        )
    ).length;

    const progressPercent = totalCells > 0 ? Math.round((matchingCount / totalCells) * 100) : 0;


    const fetchSpots = async () => {
        try {
            const result = await axios.get(`${process.env.REACT_APP_API_URL}/api/catalog/${make}/makeSpots?page=${page}&size=10`);
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
        fetchTrims();
        fetchSpotsWithoutPage();
        if (page > 0) {
            fetchSpots();
        }
    }, [page]);

    const groupedList = models.reduce((acc, obj) => {
        const firstLetter = obj.name.charAt(0).toUpperCase();
        if (!acc[firstLetter]) {
            acc[firstLetter] = [];
        }
        acc[firstLetter].push(obj);
        return acc;
    }, {});

    const sortedKeys = Object.keys(groupedList).sort();

    const makePhotoName = makeDetails && makeDetails.photo ? makeDetails.photo.name : 'placeholder.jpg';
    const photoURL = `https://newloripinbucket.s3.amazonaws.com/image/catalog/${make}/${makePhotoName}`;

    return (
        <div>
            {user?.roles.includes("ROLE_ADMIN") && (
                <ul className="nav">
                    <Link className="nav-link active" aria-current="page" to={`/catalog/${make}/addModel`}
                    >Add Model</Link>
                    <Link className="nav-link active" aria-current="page" to={`/catalog/editMake/${make}`}
                    >Edit make</Link>
                </ul>
            )}
            <div className='container'>
                <nav aria-label="breadcrumb" className='mt-3'>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/" className="text-decoration-none">Home</a></li>
                        <li className="breadcrumb-item"><a href="/catalog" className="text-decoration-none">Catalog</a></li>
                        <li className="breadcrumb-item active" aria-current="page">{make}</li>
                    </ol>
                </nav>
                <div className="card border-0 border-bottom mb-3" >
                    <div className="row g-0">
                        <div className="col-md-2 mb-3">
                            <img
                                src={photoURL}
                                style={{ width: '200px', height: 'auto' }}
                                alt={`${make} logo`}
                                className='img-fluid mt-3'
                            />
                        </div>
                        <div className="col-md-5">
                            <div className="card-body">
                                <h3 className="card-title text-start">{make}</h3>
                                <p className="card-text text-start">{makeDetails?.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3">
                    <div className='col-md-8'>
                        <div className='py-4'>
                            <div className="column-container">
                                {sortedKeys.map((letter) => (
                                    <div key={letter} className="column-group">
                                        <h4>{letter}</h4>
                                        <ul className="list-group">
                                            {groupedList[letter].map((model) => (
                                                <li className="list-group-item border-0" key={model.id}>
                                                    <a href={`/catalog/${make}/${model.name}`} className="text-decoration-none">
                                                        <p>
                                                            {model.name}
                                                        </p>
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className='col-md-4 mb-5'>
                        {user?.token ? (
                            <div className="mb-3 text-start">
                                <h6>Spots progress:</h6>
                                <div className="progress mb-2">
                                    <div
                                        className="progress-bar bg-success"
                                        role="progressbar"
                                        style={{ width: `${progressPercent}%` }}
                                        aria-valuenow={progressPercent}
                                        aria-valuemin="0"
                                        aria-valuemax="100"
                                    >
                                        {progressPercent}%
                                    </div>
                                </div>

                            </div>
                        ) : null}
                        <Grid
                            make={make}
                            user={user}
                            trims={trims}
                            spotsWithouPage={spotsWithoutPage}
                            totalCells={totalCells} />
                    </div>
                </div>

                <div className="h5 pb-1 mb-3 text-black border-bottom border-muted text-start">
                    Spots with {make}
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
    )
}
