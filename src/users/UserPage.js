import axios from 'axios';
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import Masonry from 'react-masonry-css';
import '../components/Masonry.css'

const UserPage = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [spots, setSpots] = useState([]);
    const [page, setPage] = useState(0); // Текущая страница
    const [hasMore, setHasMore] = useState(true);

    const [message, setMessage] = useState("");
    const [error, setError] = useState(null);

    const breakpointColumnsObj = {
        default: 5, // по умолчанию 4 колонки
        1100: 4,
        700: 3,
        500: 2
    };

    const [stats, setStats] = useState({
        spots: 0,
        comments: 0,
        likes: 0,
        subscribers: 0,
        subscriptions: 0
    });

    const navigate = useNavigate();
    const { user } = useAuth();
    const { userId } = useParams();

    const fetchUser = async () => {
        if (!user || !user.token) {
            setError("Отсутствует токен аутентификации.");
            setLoading(false);
            navigate('/login'); // Redirect to login page
            return;
        }

        try {
            const response = await axios.get(`http://localhost:8080/users/${userId}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            setCurrentUser(response.data);
            console.log("currentUser:", response.data)
        } catch (err) {
            console.error('Ошибка загрузки данных:', err);
            if (err.response && err.response.status === 401) {
                // If token is invalid, redirect to login
                navigate('/login');
            } else {
                setError("Не удалось загрузить данные профиля.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
        fetchSpots();
    }, []);

    const fetchSpots = async () => {
        try {
            const result = await axios.get(`http://localhost:8080/users/${userId}/userSpots?page=${page}&size=10`, {
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
            console.log("spots", spots);
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

    if (loading) {
        return <div>Загрузка...</div>;
    }

    return (
        <div className='container'>
            <nav aria-label="breadcrumb" className='mt-3'>
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><a href="/" className="text-decoration-none">Home</a></li>
                    <li className="breadcrumb-item active" aria-current="page">{currentUser.username}'s userpage</li>
                </ol>
            </nav>
            <div className="h5 pb-1 mb-3 text-black border-bottom border-black text-start">
                <div className="d-flex align-items-center">
                    {currentUser.avatar ? (
                        <img
                            src={`https://newloripinbucket.s3.amazonaws.com/image/users/${currentUser.username}/${currentUser?.avatar?.name}`}
                            alt="Avatar"
                            className="img-fluid rounded-circle shadow mx-2"
                            style={{ width: '30px', height: '30px', objectFit: 'cover' }}
                        />
                    ) : (
                        <div
                            className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center mx-2"
                            style={{ width: '30px', height: '30px', fontSize: '1rem' }}
                        >
                            {currentUser?.username.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <span>{currentUser?.username}</span>
                </div>
            </div>

            <div>
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3">
                    <div className="col text-start">
                        <p>User account was created <strong>{currentUser?.createdAt ? `${formatDistanceToNow(new Date(currentUser.createdAt), { addSuffix: true })}` : 'Неизвестно'}</strong></p>
                        <p>Subscribers: {stats.subscribers}</p>
                        <p>Subscriptions: {stats.subscriptions}</p>
                    </div>

                    <div className="col text-start">
                        <h6>Bio</h6>
                        {currentUser.bio}
                    </div>

                    <div className="col text-start">
                        <p>Spots: {stats.spots}</p>
                        <p>Comments: {stats.comments}</p>
                        <p>Likes: {stats.likes}</p>

                    </div>
                </div>
            </div>
            <div className="h5 pb-1 mt-5 mb-3 text-black border-bottom border-black text-start">
                {currentUser.username}'s spots
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
                                src={`https://newloripinbucket.s3.amazonaws.com/image/spots/${spot.user?.username}/${spot.photos?.find(photo => photo.isMain)?.name}`}
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
    );
};

export default UserPage;
