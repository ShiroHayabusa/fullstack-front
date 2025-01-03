import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

export default function ViewBodystyle() {

    const [trims, setTrims] = useState([]);
    const [bodystyle, setBodystyle] = useState({
        name: '',
        generation: '',
        facelift: ''
    });

    const { make, model, generationId, bodystyleId } = useParams();

    const [spots, setSpots] = useState([]);
    const [page, setPage] = useState(0); // Текущая страница
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        loadTrims();
        fetchSpots();
    }, []);

    useEffect(() => {
        loadBodystyle()
    }, []);

    const loadTrims = async () => {
        const result = await axios.get(
            `http://localhost:8080/catalog/${make}/${model}/${generationId}/${bodystyleId}/listTrim`);
        setTrims(result.data);
        console.log(result.data)
    }

    const loadBodystyle = async () => {
        const result = await axios.get(
            `http://localhost:8080/catalog/${make}/${model}/${generationId}/${bodystyleId}`);
        setBodystyle(result.data);
    }

    const fetchSpots = async () => {
        try {
            const result = await axios.get(`http://localhost:8080/spots/${bodystyleId}/bodystyleSpots?page=${page}&size=10`);
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
            <ul class="nav">

                <Link class="nav-link active" aria-current="page" to={`/catalog/${make}/${model}/${generationId}/${bodystyleId}/addTrim`}
                >Add Trim</Link>
                <Link class="nav-link active" aria-current="page" to={`/catalog/${make}/${model}/${generationId}/${bodystyleId}/editBodystyle`}
                >Edit bodystyle</Link>
            </ul>
            <div className='container'>
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><a href="/" className="text-decoration-none">Home</a></li>
                        <li class="breadcrumb-item"><a href="/catalog" className="text-decoration-none">Catalog</a></li>
                        <li class="breadcrumb-item"><a href={`/catalog/${make}`} className="text-decoration-none">{make}</a></li>
                        <li class="breadcrumb-item"><a href={`/catalog/${make}/${model}`} className="text-decoration-none">{model}</a></li>
                        <li class="breadcrumb-item"><a href={`/catalog/${make}/${model}/${bodystyle.generation.id}`} className="text-decoration-none">{bodystyle.generation.name}</a></li>
                        <li class="breadcrumb-item active" aria-current="page">{bodystyle.bodytype?.name}</li>
                    </ol>
                </nav>
                <div className="row row-cols-1 row-cols-sm-2">
                    <div className='col-md-8'>
                        {trims.map((trim, index) => {
                            const mainPhoto = Array.isArray(trim.photos) && trim.photos.length > 0
                                ? trim.photos.find((photo) => photo.isMain)
                                : {};
                            return (
                                <Link to={`/catalog/${make}/${model}/${bodystyle.generation.id}/${bodystyleId}/${trim.id}`} className="text-decoration-none text-black">
                                    <div className="card mb-3" key={index}>
                                        <div className="row g-0">
                                            <div className="col-md-3 text-start">
                                                <img
                                                    src={`https://newloripinbucket.s3.amazonaws.com/image/catalog/${make || 'defaultMake'}/${model || 'defaultModel'}/${bodystyle.generation.name || 'defaultGeneration'}/${bodystyle.facelift.name || 'defaultBodystyle'}/${bodystyle.bodytype?.name}/${trim.name}/${mainPhoto.name || 'defaultImage.jpg'}`}
                                                    className="img-fluid"
                                                    style={{ maxWidth: '100%', objectFit: 'cover' }}
                                                    onError={(e) => {
                                                        e.target.src = 'https://newloripinbucket.s3.amazonaws.com/image/placeholder_400x400.png'; // Путь к резервному изображению
                                                    }}
                                                ></img>
                                            </div>
                                            <div className="col-md-9 text-start">
                                                <div className="card-body">
                                                    <h5 className="card-title">
                                                        {trim.name}
                                                    </h5>
                                                    <p className="card-text">{trim.years}</p>
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
                        sadasdasd
                    </div>

                </div>
                <div className="h5 pb-1 mb-4 mt-5 text-black border-bottom border-black text-start">
                    Spots with {make} {model} {bodystyle.generation.name} {bodystyle.facelift.name} {bodystyle.bodytype?.name}
                </div>
                <div className="row row-cols-2 row-cols-md-5">
                    {spots.map((spot) => (
                        <Link to={`/spots/${spot.id}`} key={spot.id}>
                            <img
                                src={`https://newloripinbucket.s3.amazonaws.com/image/spots/${spot.photos?.find(photo => photo.isMain)?.name}`}
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

    );
}
