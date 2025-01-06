import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext';
import '../../components/ColumnContainer.css'

export default function ViewMake() {

    const [models, setModels] = useState([]);
    const [makeDetails, setMakeDetails] = useState(null);
    const { make } = useParams();
    const [spots, setSpots] = useState([]);
    const [page, setPage] = useState(0); // Текущая страница
    const [hasMore, setHasMore] = useState(true);
    const navigate = useNavigate();
    const { user } = useAuth(); // Получаем пользователя из AuthContext

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            loadModels();
            loadMakeDetails();
            fetchSpots();
        }
    }, [make, user, navigate]);


    const loadModels = async () => {
        const result = await axios.get(`http://localhost:8080/catalog/${make}`, {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        });
        setModels(result.data);
    }

    const loadMakeDetails = async () => {
        try {
            const result = await axios.get(`http://localhost:8080/catalog/editMake/${make}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            setMakeDetails(result.data);
        } catch (error) {
            console.error('Error loading make details:', error);
        }
    };

    const fetchSpots = async () => {
        try {
            const result = await axios.get(`http://localhost:8080/catalog/${make}/makeSpots?page=${page}&size=10`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            setSpots((prevSpots) => {
                const newSpots = result.data.content.filter(
                    (newSpot) => !prevSpots.some((spot) => spot.id === newSpot.id)
                );
                return [...prevSpots, ...newSpots];
            }); // Добавляем новые записи
            setHasMore(result.data.totalPages > page + 1); // Проверяем, есть ли ещё страницы
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
                                onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/100'; }} // Fallback image 
                            />
                        </div>
                        <div className="col-md-10">
                            <div className="card-body">
                                <h3 className="card-title text-start">{make}</h3>
                                <p className="card-text text-start">{makeDetails?.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
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

                <div className="h5 pb-1 mb-3 text-black border-bottom border-black text-start">
                    Spots with {make}
                </div>
                <div className="row row-cols-2 row-cols-md-5">
                    {spots.map((spot) => (
                        <Link to={`/spots/${spot.id}`} key={spot.id}>
                            <img
                                src={`https://newloripinbucket.s3.amazonaws.com/image/spots/${spot.user?.username}/${spot.photos?.find(photo => photo.isMain)?.name}`}
                                alt={spot.photos?.find(photo => photo.isMain).name}
                                className="img-fluid mb-2"
                            />
                        </Link>
                    ))}
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
