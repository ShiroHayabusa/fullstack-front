import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

export default function ViewModel() {

    const [generations, setGenerations] = useState([]);
    const { make, model } = useParams();
    const [spots, setSpots] = useState([]);
    const [page, setPage] = useState(0); // Текущая страница
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        loadGenerations();
        fetchSpots();
    }, []);

    const loadGenerations = async () => {
        const result = await axios.get(`http://localhost:8080/catalog/` + make + '/' + model);
        setGenerations(result.data);
    }

    const fetchSpots = async () => {
        try {
            const result = await axios.get(`http://localhost:8080/catalog/${make}/${model}/modelSpots?page=${page}&size=10`);
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
                <Link class="nav-link active" aria-current="page" to={`/catalog/${make}/${model}/addGeneration`}
                >Add Generation</Link>
                <Link className="nav-link active" aria-current="page" to={`/catalog/${make}/${model}/editModel`}
                >Edit model</Link>
            </ul>
            <div className='container'>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/" className="text-decoration-none">Home</a></li>
                        <li className="breadcrumb-item"><a href="/catalog" className="text-decoration-none">Catalog</a></li>
                        <li className="breadcrumb-item"><a href={`/catalog/${make}`} className="text-decoration-none">{make}</a></li>
                        <li className="breadcrumb-item active" aria-current="page">{model}</li>
                    </ol>
                </nav>
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
                <div className="h5 pb-1 mb-4 mt-5 text-black border-bottom border-black text-start">
                    Spots with {make} {model}
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
    )
}
