import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext';
import Masonry from 'react-masonry-css';
import '../../components/Masonry.css'

export default function ViewModel() {

    const [generations, setGenerations] = useState([]);
    const [modelDetails, setModelDetails] = useState(null);
    const { make, model } = useParams();
    const [spots, setSpots] = useState([]);
    const [page, setPage] = useState(0); // Текущая страница
    const [hasMore, setHasMore] = useState(true);
    const navigate = useNavigate();
    const { user } = useAuth(); // Получаем пользователя из AuthContext

    const breakpointColumnsObj = {
        default: 5,
        1100: 4,
        700: 3,
        500: 2
    };

    const loadModelDetails = async () => {
        try {
            const result = await axios.get(`http://localhost:8080/catalog/${make}/${model}/editModel`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            setModelDetails(result.data);
        } catch (error) {
            console.error('Error loading model details:', error);
        }
    };

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            loadGenerations();
            fetchSpots();
            loadModelDetails();
        }
    }, [user]);

    const loadGenerations = async () => {
        const result = await axios.get(`http://localhost:8080/catalog/` + make + '/' + model, {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        });
        setGenerations(result.data);
    }

    const fetchSpots = async () => {
        try {
            const result = await axios.get(`http://localhost:8080/catalog/${make}/${model}/modelSpots?page=${page}&size=10`, {
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

    return (
        <div>
            {user?.roles.includes("ROLE_ADMIN") && (
                <ul className="nav">
                    <Link className="nav-link active" aria-current="page" to={`/catalog/${make}/${model}/addGeneration`}
                    >Add Generation</Link>
                    <Link className="nav-link active" aria-current="page" to={`/catalog/${make}/${model}/editModel`}
                    >Edit model</Link>
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
                    {generations.map((generation) => (
                        //   <ul className="list-group list-group-flush" key={index}>
                        //       <Link className="list-group-item" to={`/catalog/${make}/${model}/${generation.id}`}>{generation.name}</Link>
                        //   </ul>

                        <div className="col" key={generation.id}>
                            <Link to={`/catalog/${make}/${model}/${generation.id}`} className="text-decoration-none text-black">
                                <div className="card">
                                    <img
                                        src={`https://newloripinbucket.s3.amazonaws.com/image/catalog/${make || 'defaultMake'}/${model || 'defaultModel'}/${generation.name || 'defaultGeneration'}/${generation?.photo?.name || 'defaultImage.jpg'}`}
                                        className="card-img-top"
                                        alt="..."></img>
                                    <div className="card-body">
                                        <h5 className="card-title">
                                            {generation.name}
                                        </h5>
                                        <p className="card-text">{generation.years}</p>
                                    </div>
                                </div>
                            </Link>
                        </div>

                    ))
                    }
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
