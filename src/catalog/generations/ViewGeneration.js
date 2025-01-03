import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

export default function ViewGeneration() {
    const [bodystyles, setBodystyles] = useState([]);
    const [facelifts, setFacelifts] = useState([]);
    const [generation, setGeneration] = useState({
        name: ''
    });

    const { make, model, generationId } = useParams();

    const [spots, setSpots] = useState([]);
    const [page, setPage] = useState(0); // Текущая страница
    const [hasMore, setHasMore] = useState(true);

    // Объединяем все вызовы данных в один useEffect
    useEffect(() => {
        const loadData = async () => {
            await Promise.all([loadFacelifts(), loadBodystyles(), loadGeneration()]);
        };
        loadData();
        fetchSpots();
    }, []);

    const loadFacelifts = async () => {
        const result = await axios.get(`http://localhost:8080/catalog/${make}/${model}/${generationId}/faceliftList`);
        setFacelifts(result.data);
    };

    const loadBodystyles = async () => {
        const result = await axios.get(`http://localhost:8080/catalog/${make}/${model}/${generationId}/bodystyles`);
        setBodystyles(result.data);
    };

    const loadGeneration = async () => {
        const result = await axios.get(`http://localhost:8080/catalog/${make}/${model}/${generationId}`);
        setGeneration(result.data);
    };

    const fetchSpots = async () => {
        try {
            const result = await axios.get(`http://localhost:8080/spots/${generationId}/generationSpots?page=${page}&size=10`);
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
            <ul className="nav">
                <Link className="nav-link active" aria-current="page" to={`/catalog/${make}/${model}/${generationId}/addFacelift`}>Add facelift</Link>
                <Link className="nav-link active" aria-current="page" to={`/catalog/${make}/${model}/${generationId}/addBodystyle`}>Add bodystyle</Link>
                <Link className="nav-link active" aria-current="page" to={`/catalog/${make}/${model}/${generationId}/editGeneration`}>Edit generation</Link>
            </ul>
            <div className='container'>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/" className="text-decoration-none">Home</a></li>
                        <li className="breadcrumb-item"><a href="/catalog" className="text-decoration-none">Catalog</a></li>
                        <li className="breadcrumb-item"><a href={`/catalog/${make}`} className="text-decoration-none">{make}</a></li>
                        <li className="breadcrumb-item"><a href={`/catalog/${make}/${model}`} className="text-decoration-none">{model}</a></li>
                        <li className="breadcrumb-item active" aria-current="page">{generation.name}</li>
                    </ol>
                </nav>
                {facelifts.map((facelift) => (
                    <div className="mt-3" key={facelift.id}>
                        <div className="h5 pb-1 text-black border-bottom border-black text-start">
                            {facelift.name}
                            <Link to={`/catalog/${make}/${model}/${generationId}/${facelift.id}/editFacelift`} className="ms-3 text-decoration-none">Edit facelift</Link>
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
                <div className="h5 pb-1 mb-4 mt-5 text-black border-bottom border-black text-start">
                    Spots with {make} {model} {generation.name}
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
