import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';

export default function Spots() {
    const [spots, setSpots] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // Текущая страница
    const [spotsPerPage] = useState(20); // Количество элементов на странице
    const { user } = useAuth();
    const navigate = useNavigate();

    const loadSpots = async () => {
        try {
            const result = await axios.get('http://localhost:8080/spots/mySpots', {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            setSpots(result.data);
        } catch (error) {
            console.error("Failed to fetch spots", error);
        }
    };

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            loadSpots();
        }
    }, [user]);

    const indexOfLastSpot = currentPage * spotsPerPage;
    const indexOfFirstSpot = indexOfLastSpot - spotsPerPage;
    const currentSpots = spots.slice(indexOfFirstSpot, indexOfLastSpot);

    // Изменение страницы
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div>
            <div className="container">
                <nav aria-label="breadcrumb" className='mt-3'>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <Link to="/" className="text-decoration-none">Home</Link>
                        </li>
                        <li className="breadcrumb-item">
                            <Link to="/spots" className="text-decoration-none">Spots</Link>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">My spots</li>
                    </ol>
                </nav>
                <div className="row row-cols-1 row-cols-md-4 g-4">
                    {currentSpots.map((spot) => (
                        <div className="col" key={spot.id}>
                            <Link to={`/spots/${spot.id}`} className="text-decoration-none text-black">
                                <div className="card h-100">
                                    <img
                                        src={`https://newloripinbucket.s3.amazonaws.com/image/spots/${spot.user?.username}/${spot?.photos[0]?.name || 'defaultImage.jpg'}`}
                                        className="card-img-top"
                                        alt={spot?.photos[0]?.name || 'Default Image'}
                                    />
                                    <div className="card-body">
                                        <p className="card-text text-start">Spotted by {spot.user?.username}</p>
                                    </div>
                                    <div className="card-footer">
                                        <small className="text-body-secondary text-start">
                                            {format(new Date(spot.createdAt), 'MMMM d yyyy HH:mm')}
                                        </small>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
                {/* Компонент пагинации */}
                <Pagination
                    spotsPerPage={spotsPerPage}
                    totalSpots={spots.length}
                    paginate={paginate}
                    currentPage={currentPage}
                />
            </div>
        </div>
    );
}

// Компонент пагинации
function Pagination({ spotsPerPage, totalSpots, paginate, currentPage }) {
    const pageNumbers = [];
    const totalPages = Math.ceil(totalSpots / spotsPerPage);
    const maxVisiblePages = 5; // Максимальное количество отображаемых страниц

    // Определение диапазона отображаемых страниц
    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    return (
        <nav className='mt-3'>
            <ul className="pagination justify-content-center" style={{ fontSize: '16px', fontWeight: '350', listStyleType: 'none', padding: 0 }}>
                {/* Ссылка на первую страницу */}
                {currentPage > 1 && (
                    <li className="page-item" style={{ margin: '0 5px' }}>
                        <span
                            onClick={() => paginate(1)}
                            style={{ cursor: 'pointer', color: 'blue' }}
                        >
                            First
                        </span>
                    </li>
                )}
                {/* Ссылка на предыдущую страницу */}
                {currentPage > 1 && (
                    <li className="page-item" style={{ margin: '0 5px' }}>
                        <span
                            onClick={() => paginate(currentPage - 1)}
                            style={{ cursor: 'pointer', color: 'blue' }}
                        >
                            Prev
                        </span>
                    </li>
                )}
                {/* Номера страниц */}
                {pageNumbers.map((number) => (
                    <li key={number} className="page-item" style={{ margin: '0 5px' }}>
                        <span
                            onClick={() => paginate(number)}
                            style={{
                                cursor: 'pointer',
                                color: number === currentPage ? 'red' : 'blue',
                                fontWeight: number === currentPage ? 'bold' : '400',
                            }}
                        >
                            {number}
                        </span>
                    </li>
                ))}
                {/* Ссылка на следующую страницу */}
                {currentPage < totalPages && (
                    <li className="page-item" style={{ margin: '0 5px' }}>
                        <span
                            onClick={() => paginate(currentPage + 1)}
                            style={{ cursor: 'pointer', color: 'blue' }}
                        >
                            Next
                        </span>
                    </li>
                )}
                {/* Ссылка на последнюю страницу */}
                {currentPage < totalPages && (
                    <li className="page-item" style={{ margin: '0 5px' }}>
                        <span
                            onClick={() => paginate(totalPages)}
                            style={{ cursor: 'pointer', color: 'blue' }}
                        >
                            Last
                        </span>
                    </li>
                )}
            </ul>
        </nav>
    );
}




