import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Loader } from '@googlemaps/js-api-loader';
import { Modal, Button } from 'react-bootstrap';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import ShareButtons from '../components/ShareButtons';
import GoogleMapWithMarker from '../components/GoogleMapWithMarker';

export default function ViewSpot() {
    const [spot, setSpot] = useState({ caption: '', photos: [], latitude: null, longitude: null });

    const { id } = useParams();
    const mapContainerRef = useRef(null); // Ссылка на контейнер карты
    const navigate = useNavigate();
    const { user } = useAuth(); // Получаем пользователя из AuthContext

    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyContent, setReplyContent] = useState('');
    const [expandedReplies, setExpandedReplies] = useState({});

    const [likes, setLikes] = useState(0);
    const [hasLiked, setHasLiked] = useState(false);



    const loadSpot = async () => {
        try {
            const result = await axios.get(`http://localhost:8080/spots/${id}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            setSpot(result.data);

            setComments(result.data.comments);

            const likesResult = await axios.get(`http://localhost:8080/spots/${id}/likes`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            setLikes(likesResult.data.count);
            setHasLiked(likesResult.data.hasLiked);
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
        }
    };



    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            loadSpot();
        }
    }, [user]);

    const [showModal, setShowModal] = useState(false); // Состояние для отображения модалки
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

    const handleOpenModal = (index) => {
        setCurrentPhotoIndex(index); // Устанавливаем индекс текущего фото
        setShowModal(true); // Открываем модалку
    };

    const handleCloseModal = () => {
        setShowModal(false); // Закрываем модалку
    };

    const handlePrevPhoto = () => {
        setCurrentPhotoIndex((prevIndex) =>
            prevIndex === 0 ? spot.photos.length - 1 : prevIndex - 1
        );
    };

    const handleNextPhoto = () => {
        setCurrentPhotoIndex((prevIndex) =>
            prevIndex === spot.photos.length - 1 ? 0 : prevIndex + 1
        );
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "ArrowLeft") {
                handlePrevPhoto();
            } else if (e.key === "ArrowRight") {
                handleNextPhoto();
            } else if (e.key === "Escape") {
                handleCloseModal();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [handlePrevPhoto, handleNextPhoto, handleCloseModal]);

    const deleteSpot = async () => {
        const confirmDelete = window.confirm(
            'Are you sure you want to delete this spot? This action cannot be undone.'
        );
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:8080/spots/deleteSpot/${id}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                alert('Spot deleted successfully');
                window.location.href = '/spots';
            } catch (error) {
                console.error('Failed to delete spot:', error);
                alert('An error occurred while deleting the spot.');
            }
        }
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) {
            alert('Комментарий не может быть пустым.');
            return;
        }

        try {
            const result = await axios.post(
                `http://localhost:8080/spots/${id}/addComment`,
                { content: newComment },
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                }
            );
            setComments((prevComments) => [result.data, ...prevComments]);
            setNewComment(''); // Очищаем поле ввода
        } catch (error) {
            console.error('Ошибка добавления комментария:', error);
            alert('Не удалось добавить комментарий.');
        }
    };

    const handleReplyClick = (commentId) => {
        setReplyingTo((prev) => (prev === commentId ? null : commentId)); // Если форма открыта, закрываем её
    };


    const toggleReplies = (commentId) => {
        setExpandedReplies((prev) => ({
            ...prev,
            [commentId]: !prev[commentId], // Инвертируем состояние для данного комментария
        }));
    };

    const handleAddReply = async (parentId) => {
        if (!replyContent.trim()) {
            alert('Reply cannot be empty.');
            return;
        }

        try {
            const response = await axios.post(
                `http://localhost:8080/comments/${parentId}/replies`,
                { content: replyContent },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );

            // Обновление состояния комментариев
            setComments((prevComments) =>
                prevComments.map((comment) =>
                    comment.id === parentId
                        ? { ...comment, replies: [response.data, ...(comment.replies || [])] }
                        : comment
                )
            );

            // Раскрываем реплаи для родительского комментария
            setExpandedReplies((prev) => ({
                ...prev,
                [parentId]: true, // Устанавливаем состояние "развернуто" для родителя
            }));
            setReplyContent('');
            setReplyingTo(null);
        } catch (error) {
            console.error('Failed to add reply:', error);
        }
    };


    const toggleLike = async () => {
        try {
            const response = await axios.post(
                `http://localhost:8080/spots/${id}/like`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                }
            );
            setLikes(response.data.count);
            setHasLiked(response.data.hasLiked);
        } catch (error) {
            console.error('Ошибка переключения лайка:', error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this comment?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`http://localhost:8080/api/comments/${commentId}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });

            // Удаляем комментарий из состояния
            setComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId));
        } catch (error) {
            console.error("Error deleting comment:", error);
            alert("Failed to delete comment. Please try again.");
        }
    };

    const handleDeleteReply = async (commentId, replyId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this reply?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`http://localhost:8080/api/comments/${commentId}/replies/${replyId}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });

            // Удаляем реплай из состояния
            setComments((prevComments) =>
                prevComments.map((comment) =>
                    comment.id === commentId
                        ? {
                            ...comment,
                            replies: comment.replies.filter((reply) => reply.id !== replyId),
                        }
                        : comment
                )
            );
        } catch (error) {
            console.error("Error deleting reply:", error);
            alert("Failed to delete reply. Please try again.");
        }
    };


    return (
        <div>
            <div className="container">
                <div className="d-flex justify-content-between align-items-center">
                    <nav aria-label="breadcrumb" className='mt-3'>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <Link to="/" className="text-decoration-none">Home</Link>
                            </li>
                            <li className="breadcrumb-item">
                                <Link to="/spots/" className="text-decoration-none">Spots</Link>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page">Spot {spot.id}</li>
                        </ol>
                    </nav>
                    <div>
                        <ShareButtons />
                    </div>
                </div>
                {user.username === spot.user?.username && (
                    <ul className="nav mt-3 mb-3" style={{ display: "flex", alignItems: "center" }}>
                        <li className="nav-item">
                            <button
                                className="btn btn-outline-primary"
                                onClick={() => navigate(`/spots/editSpot/${id}`)}
                            >
                                Edit Spot
                            </button>
                        </li>

                        <li className="nav-item" style={{ marginLeft: "auto" }}>
                            <button className="btn btn-outline-danger" onClick={deleteSpot}>
                                Delete Spot
                            </button>
                        </li>

                    </ul>
                )}

                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3">
                    <div className="col">
                        {spot.photos && spot.photos.length > 0 && (
                            <div>
                                {spot.photos.map((photo, index) => (
                                    <img
                                        key={index}
                                        src={`https://newloripinbucket.s3.amazonaws.com/image/spots/${spot.user?.username}/${photo.name}`}
                                        alt={photo.name}
                                        className="img-fluid mb-2"
                                        onClick={() => handleOpenModal(index)} // Открытие модального окна
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                    {/* Bootstrap Modal */}
                    <Modal
                        show={showModal}
                        onHide={handleCloseModal}
                        size="lg"
                    >

                        <Modal.Body>
                            <div className="d-flex justify-content-center">
                                <img
                                    src={`https://newloripinbucket.s3.amazonaws.com/image/spots/${spot.user?.username}/${spot.photos[currentPhotoIndex]?.name}`}
                                    className="img-fluid"
                                    alt=""
                                />
                            </div>
                        </Modal.Body>
                        <Modal.Footer className="d-flex justify-content-between">
                            <span>
                                Photo {currentPhotoIndex + 1} of {spot.photos.length}
                            </span>
                            <div>
                                <Button variant="outline-secondary btn-sm" onClick={handlePrevPhoto} className="me-2">
                                    ← Previous
                                </Button>
                                <Button variant="outline-secondary btn-sm" onClick={handleNextPhoto} className="me-2">
                                    Next →
                                </Button>
                                <Button variant="outline-primary btn-sm" onClick={handleCloseModal}>
                                    Close
                                </Button>
                            </div>
                        </Modal.Footer>

                    </Modal>
                    <div className="col-md-5">
                        <h5 className="pb-1 mb-4 text-black border-bottom d-flex justify-content-between align-items-center">
                            <span className="text-start">
                                Spotted by {spot.user?.username}
                            </span>
                            <span className="d-flex align-items-center">
                                <i
                                    className={`bi bi-heart${hasLiked ? '-fill' : ''}`}
                                    style={{
                                        cursor: 'pointer',
                                        color: hasLiked ? 'red' : 'gray',
                                        fontSize: '24px'
                                    }}
                                    onClick={toggleLike}
                                ></i>
                                <span className="ms-2">{likes}</span>
                            </span>
                        </h5>
                        <p className='text-start'>{spot.caption}</p>
                        <div className="text-start">
                            <table className="table table-borderless">
                                <tbody>
                                    <tr>
                                        <th scope="row">Make:</th>
                                        <td className='text-start'>
                                            <Link to={`/catalog/${spot.make?.name}`} className="text-decoration-none">
                                                {spot.make?.name}
                                            </Link>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Model:</th>
                                        <td>
                                            <Link to={`/catalog/${spot.make?.name}/${spot.model?.name}`} className="text-decoration-none">
                                                {spot.model?.name}
                                            </Link>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Generation:</th>
                                        <td>
                                            <Link to={`/catalog/${spot.make?.name}/${spot.model?.name}/${spot.generation?.id}`} className="text-decoration-none">
                                                {spot.generation?.name}
                                            </Link>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Facelift:</th>
                                        <td>
                                            <Link to={`/catalog/${spot.make?.name}/${spot.model?.name}/${spot.generation?.id}`} className="text-decoration-none">
                                                {spot.facelift?.name}
                                            </Link>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Bodystyle:</th>
                                        <td>
                                            <Link to={`/catalog/${spot.make?.name}/${spot.model?.name}/${spot.generation?.id}/${spot.bodystyle?.id}`} className="text-decoration-none">
                                                {spot.bodystyle?.bodytype?.name}
                                            </Link>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Trim:</th>
                                        <td>
                                            <Link to={`/catalog/${spot.make?.name}/${spot.model?.name}/${spot.generation?.id}/${spot.bodystyle?.id}/${spot.trim?.id}`} className="text-decoration-none">
                                                {spot.trim?.name}
                                            </Link>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div>
                            <div>

                                <div className="mt-4 mb-3">
                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Add a comment"
                                    ></textarea>
                                    <button className="btn btn-outline-secondary mt-2" onClick={handleAddComment}>
                                        Comment
                                    </button>
                                </div>
                                <h5 className='text-start'>Comments:</h5>
                                <ul className="list-group list-group-flush text-start">
                                    {comments.map((comment) => (
                                        <li key={comment.id} className="list-group-item py-2">
                                            <div className="d-flex">
                                                {/* Аватар пользователя */}
                                                {comment.user.avatar ? (
                                                    <img
                                                        src={`https://newloripinbucket.s3.amazonaws.com/image/users/${comment.user.username}/${comment.user.avatar.name}`}
                                                        alt={`${comment.user.username}'s avatar`}
                                                        className="rounded-circle me-2"
                                                        style={{
                                                            width: '40px',
                                                            height: '40px',
                                                            objectFit: 'cover',
                                                            alignSelf: 'start',
                                                        }}
                                                    />
                                                ) : (
                                                    <div
                                                        className="rounded-circle me-2 d-flex justify-content-center align-items-center"
                                                        style={{
                                                            width: '40px',
                                                            height: '40px',
                                                            backgroundColor: '#6c757d',
                                                            color: '#fff',
                                                            fontSize: '16px',
                                                            fontWeight: 'bold',
                                                            alignSelf: 'start',
                                                        }}
                                                    >
                                                        {comment.user.username[0].toUpperCase()}
                                                    </div>
                                                )}
                                                <div className="d-flex flex-column w-100">
                                                    {/* Имя пользователя и время */}
                                                    <span className="d-flex justify-content-between align-items-center">
                                                        <strong>{comment.user.username}</strong>
                                                        <span className="text-muted small">
                                                            {comment?.createdAt
                                                                ? `${formatDistanceToNow(new Date(comment.createdAt)).replace('about ', '')}`
                                                                : 'Unknown'}
                                                        </span>
                                                    </span>
                                                    {/* Контент комментария */}
                                                    <p className="mb-0">{comment.content}</p>
                                                    {/* Кнопка "Reply" */}
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <button
                                                            className="btn btn-sm btn-link text-muted p-0 mt-1 text-decoration-none"
                                                            style={{
                                                                fontSize: '12px', // Уменьшение текста
                                                                alignSelf: 'start',
                                                            }}
                                                            onClick={() => handleReplyClick(comment.id)} // Открываем или закрываем форму
                                                        >
                                                            {replyingTo === comment.id ? 'Cancel' : 'Reply'}
                                                        </button>
                                                        {comment.user.username === user.username && ( // Показываем кнопку только для своих комментариев
                                                            <button
                                                                className="btn btn-sm btn-link text-muted p-0"
                                                                style={{
                                                                    fontSize: '12px', // Уменьшение текста
                                                                    alignSelf: 'start',
                                                                }}
                                                                onClick={() => handleDeleteComment(comment.id)}
                                                            >
                                                                <i className="bi bi-trash"></i>
                                                            </button>
                                                        )}
                                                    </div>
                                                    {/* Форма для добавления ответа */}
                                                    {replyingTo === comment.id && (
                                                        <div className="mt-2">
                                                            <textarea
                                                                className="form-control"
                                                                rows="2"
                                                                value={replyContent}
                                                                onChange={(e) => setReplyContent(e.target.value)}
                                                                placeholder="Write your reply..."
                                                            ></textarea>
                                                            <button
                                                                className="btn btn-outline-secondary btn-sm mt-2"
                                                                onClick={() => handleAddReply(comment.id)}
                                                            >
                                                                Reply
                                                            </button>
                                                        </div>
                                                    )}
                                                    {/* Кнопка для переключения реплаев */}
                                                    {comment.replies && comment.replies.length > 0 && (
                                                        <button
                                                            className="btn btn-link p-0 mt-1 text-decoration-none"
                                                            style={{
                                                                fontSize: '12px', // Уменьшение текста
                                                                alignSelf: 'start',
                                                            }}
                                                            onClick={() => toggleReplies(comment.id)}
                                                        >
                                                            {expandedReplies[comment.id] ? 'Hide Replies' : 'View Replies'}
                                                        </button>
                                                    )}
                                                    {/* Отображение реплаев */}
                                                    {expandedReplies[comment.id] && comment.replies && comment.replies.length > 0 && (
                                                        <ul className="list-group list-group-flush ms-4">
                                                            {comment.replies.map((reply) => (
                                                                <li key={reply.id} className="list-group-item py-2">
                                                                    <div className="d-flex">
                                                                        {reply.user?.avatar ? (
                                                                            <img
                                                                                src={`https://newloripinbucket.s3.amazonaws.com/image/users/${reply.user.username}/${reply.user.avatar?.name}`}
                                                                                alt={`${reply.user?.username}'s avatar`}
                                                                                className="rounded-circle me-2"
                                                                                style={{
                                                                                    width: '30px',
                                                                                    height: '30px',
                                                                                    objectFit: 'cover',
                                                                                    alignSelf: 'start',
                                                                                }}
                                                                            />
                                                                        ) : (
                                                                            <div
                                                                                className="d-flex justify-content-center align-items-center rounded-circle bg-secondary text-white"
                                                                                style={{
                                                                                    width: '30px',
                                                                                    height: '30px',
                                                                                    fontSize: '12px',
                                                                                    fontWeight: 'bold',
                                                                                    boxSizing: 'border-box',
                                                                                }}
                                                                            >
                                                                                {reply.user?.username[0].toUpperCase()}
                                                                            </div>
                                                                        )}
                                                                        <div className="d-flex flex-column w-100">
                                                                            <span className="d-flex justify-content-between align-items-center">
                                                                                <strong>{reply.user?.username}</strong>
                                                                                <span className="text-muted small">
                                                                                    {reply?.createdAt
                                                                                        ? `${formatDistanceToNow(new Date(reply.createdAt)).replace(
                                                                                            'about ',
                                                                                            ''
                                                                                        )}`
                                                                                        : 'Unknown'}
                                                                                </span>
                                                                            </span>
                                                                            <p className="mb-0">{reply.content}</p>
                                                                            <div className="d-flex justify-content-between align-items-center">
                                                                                {reply.user.username === user.username && ( // Показываем кнопку только для своих комментариев
                                                                                    <button
                                                                                        className="btn btn-sm btn-link text-muted p-0"
                                                                                        style={{
                                                                                            fontSize: '12px', // Уменьшение текста
                                                                                            alignSelf: 'start',
                                                                                        }}
                                                                                        onClick={() => handleDeleteReply(comment.id, reply.id)}
                                                                                    >
                                                                                        <i className="bi bi-trash"></i>
                                                                                    </button>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>




                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="container">
                            <div style={{ padding: '20px' }}>
                                <GoogleMapWithMarker
                                    spots={[spot]}
                                    latitude={spot.latitude}
                                    longitude={spot.longitude}
                                />
                            </div>
                        </div>
                        <div>
                            <p className='text-start mx-5'>
                                City: {spot?.city}
                            </p>
                            <p className='text-start mx-5'>
                                Country: {spot?.country}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
