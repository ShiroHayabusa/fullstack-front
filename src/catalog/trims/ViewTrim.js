import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Modal, Button } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import GoogleMapWithMarker from '../../components/GoogleMapWithMarker';
import Masonry from 'react-masonry-css';
import '../../components/Masonry.css'

export default function ViewTrim() {
    const [showModal, setShowModal] = useState(false); // Состояние для отображения модалки
    const [showMapModal, setShowMapModal] = useState(false); // Состояние для карты
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [spots, setSpots] = useState([]);
    const navigate = useNavigate();
    const { user } = useAuth(); // Получаем пользователя из AuthContext

    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyContent, setReplyContent] = useState('');
    const [expandedReplies, setExpandedReplies] = useState({});

    const breakpointColumnsObj = {
        default: 2,
        1100: 2,
        700: 2,
        500: 2
    };


    const handleOpenModal = (index) => {
        if (trim && trim.photos && trim.photos.length > 0) {
            setCurrentPhotoIndex(index); // Устанавливаем индекс текущего фото
            setShowModal(true); // Открываем модалку
        }
    };

    const handleCloseModal = () => {
        setShowModal(false); // Закрываем модалку
    };

    const handleNextPhoto = () => {
        setCurrentPhotoIndex((prevIndex) =>
            prevIndex === trim.photos.length - 1 ? 0 : prevIndex + 1
        );
    };

    const handlePrevPhoto = () => {
        setCurrentPhotoIndex((prevIndex) =>
            prevIndex === 0 ? trim.photos.length - 1 : prevIndex - 1
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

    const [trim, setTrim] = useState({
        name: '',
        bodystyle: '',
        description: '',
        engine: '',
        transmission: '',
        body: '',
        drivetrain: '',
        years: '',
        tuner: '',
        amount: '',
        maxSpeed: '',
        acceleration: '',
        weight: '',
        uniq: '',
        electric: '',
        hybrid: '',
        battery: '',
        range: '',
        market: ''
    });

    const { make, model, generationId, bodystyleId, trimId } = useParams();

    const fetchSpots = async () => {
        try {
            const result = await axios.get(`http://localhost:8080/catalog/${trimId}/spots`, {
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
            loadTrim();
            fetchSpots();
        }
    }, [user]);

    const loadTrim = async () => {
        const result = await axios.get(
            `http://localhost:8080/catalog/${make}/${model}/${generationId}/${bodystyleId}/${trimId}`, {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        });
        setTrim(result.data);
        setComments(result.data.comments);
    }

    const photos = (trim && trim.photos) || [];

    const handleAddComment = async () => {
        if (!newComment.trim()) {
            alert('Комментарий не может быть пустым.');
            return;
        }

        try {
            const result = await axios.post(
                `http://localhost:8080/trims/${trimId}/comments`,
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
            {user?.roles.includes("ROLE_ADMIN") && (
                <ul className="nav">
                    <li className="nav-item">
                        <Link className="nav-link active" aria-current="page" to={`/catalog/${make}/${model}/${generationId}/${bodystyleId}/${trim.id}/editTrim`}
                        >Edit Trim</Link>
                    </li>
                </ul>
            )}

            <div className='container'>
                <nav aria-label="breadcrumb" className='mt-3'>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/" className="text-decoration-none">Home</a></li>
                        <li className="breadcrumb-item"><a href="/catalog" className="text-decoration-none">Catalog</a></li>
                        <li className="breadcrumb-item"><a href={`/catalog/${make}`} className="text-decoration-none">{make}</a></li>
                        <li className="breadcrumb-item"><a href={`/catalog/${make}/${model}`} className="text-decoration-none">{model}</a></li>
                        <li className="breadcrumb-item"><a href={`/catalog/${make}/${model}/${generationId}`} className="text-decoration-none">{trim.bodystyle.generation?.name}</a></li>
                        <li className="breadcrumb-item"><a href={`/catalog/${make}/${model}/${generationId}/${bodystyleId}`} className="text-decoration-none">{trim.bodystyle.bodytype?.name}</a></li>
                        <li className="breadcrumb-item active" aria-current="page">{trim.name}</li>
                    </ol>
                </nav>

                <div className="h5 pb-1 mb-3 text-black border-bottom border-black text-start">
                    {make + ' ' + model + ' ' + trim.name}
                </div>

                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3">

                    <div className="col">
                        {trim.photos && trim.photos.length > 0 && (
                            <div>
                                {trim.photos.map((photo, index) => (
                                    <img
                                        key={index}
                                        src={`https://newloripinbucket.s3.amazonaws.com/image/catalog/${make}/${model}/${trim.bodystyle.generation?.name}/${trim.bodystyle.facelift?.name}/${trim.bodystyle.bodytype?.name}/${trim.name}/${photo.name}`}
                                        alt={photo.name}
                                        className="img-fluid mb-2"
                                        onClick={() => handleOpenModal(index)} // Открытие модального окна
                                    />
                                ))}
                            </div>
                        )}

                        {/* Bootstrap Modal */}
                        <Modal show={showModal} onHide={handleCloseModal} size="lg">
                            <Modal.Body>
                                <div className="d-flex justify-content-center">
                                    {trim && trim.photos && trim.photos.length > 0 && trim.photos[currentPhotoIndex] ? (
                                        <img
                                            src={`https://newloripinbucket.s3.amazonaws.com/image/catalog/${make}/${model}/${trim?.bodystyle?.generation?.name}/${trim?.bodystyle?.facelift?.name}/${trim?.bodystyle?.bodytype?.name}/${trim?.name}/${trim.photos[currentPhotoIndex]?.name}`}
                                            className="img-fluid"
                                            alt="Car photo"
                                        />
                                    ) : (
                                        <p>Фото не доступны</p>
                                    )}
                                </div>
                            </Modal.Body>
                            <Modal.Footer className="d-flex justify-content-between">
                                <span>
                                    Photo {trim && trim.photos ? currentPhotoIndex + 1 : 0} of {trim && trim.photos ? trim.photos.length : 0}
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
                    </div>
                    <div className="col">
                        <ul className="list-group list-group-flush">

                            <li className="list-group-item text-start">
                                Years of production: {trim.years}
                            </li>

                            <li className="list-group-item text-start">
                                Market: {trim.market?.name}
                            </li>

                            <li className="list-group-item text-start">
                                Amount: {trim.amount}
                            </li>

                            <li className="list-group-item text-start">
                                {trim.description}
                            </li>

                            <li className="list-group-item text-start">
                                Engine: <Link to={`/administration/engines/${make}/${trim.engine?.id}`} className="text-decoration-none">{trim.engine?.name}</Link>
                                {trim.engine && (
                                    <p>{trim.engine?.displacement} l, {trim.engine?.power} hp, {trim.engine?.torque} Nm</p>
                                )}
                            </li>

                            <li className="list-group-item text-start">
                                Transmission: <Link to={`/administration/transmissions/${make}/${trim.transmission?.id}`} className="text-decoration-none">{trim.transmission?.name}</Link>
                                <p>{trim.transmission?.transmissionType?.name}</p>
                            </li>

                            <li className="list-group-item text-start">
                                Body: <Link to={`/administration/bodies/${make}/${trim.body?.id}`} className="text-decoration-none">{trim.body?.name}</Link>
                            </li>

                            <li className="list-group-item text-start">
                                Drivetrain: {trim.drivetrain?.name}
                            </li>

                        </ul>



                        <ul className="list-group list-group-flush">
                            {trim.maxSpeed && (
                                <li className="list-group-item text-start">
                                    Max speed: {trim.maxSpeed} km/h
                                </li>
                            )}
                            {trim.acceleration && (
                                <li className="list-group-item text-start">
                                    Acceleration (0-100 km/h): {trim.acceleration} s
                                </li>
                            )}
                            {trim.weight && (
                                <li className="list-group-item text-start">
                                    Weight: {trim.weight} kg
                                </li>
                            )}
                            {trim.bodystyle.length && (
                                <li className="list-group-item text-start">
                                    Length: {trim.bodystyle.length} mm
                                </li>
                            )}
                            {trim.bodystyle.width && (
                                <li className="list-group-item text-start">
                                    Width: {trim.bodystyle.width} mm
                                </li>
                            )}
                            {trim.bodystyle.height && (
                                <li className="list-group-item text-start">
                                    Height: {trim.bodystyle.height} mm
                                </li>
                            )}
                            {trim.bodystyle.base && (
                                <li className="list-group-item text-start">
                                    Wheelbase: {trim.bodystyle.base} mm
                                </li>
                            )}
                        </ul>
                    </div>
                    <div className="col text-start">
                        <div className="d-flex justify-content-between align-items-center">
                            <h4>Spots with this car:</h4>
                            <div>
                                <Button
                                    variant="link"
                                    className="p-0 mb-1 text-decoration-none d-inline-flex align-items-center"
                                    onClick={() => setShowMapModal(true)}
                                >
                                    <i className="bi bi-map me-1" />
                                    Map
                                </Button>
                            </div>
                        </div>
                        <div className="row row-cols-2 row-cols-md-2">
                            <Masonry
                                breakpointCols={breakpointColumnsObj}
                                className="my-masonry-grid"
                                columnClassName="my-masonry-grid_column"
                            >
                                {spots.map((spot) => (
                                    <Link to={`/spots/${spot.id}`}>
                                        <img
                                            key={spot.id}
                                            src={`https://newloripinbucket.s3.amazonaws.com/image/spots/${spot.user?.username}/${spot.id}/${spot.photos?.find(photo => photo.isMain).name}`}
                                            alt={spot.photos?.find(photo => photo.isMain).name}
                                            className="img-fluid mb-2"
                                        />
                                    </Link>
                                ))}
                            </Masonry>
                        </div>
                        {/* Modal for Map */}
                        <Modal show={showMapModal} onHide={() => setShowMapModal(false)} size="lg" centered>
                            <Modal.Body>
                                <GoogleMapWithMarker spots={spots} />
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="outline-primary btn-sm" onClick={() => setShowMapModal(false)}>
                                    Close
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                </div>
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-2">
                    <div className="mb-3">
                        <textarea
                            className="form-control mt-3"
                            rows="3"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment"
                        ></textarea>
                        <button className="btn btn-outline-secondary mt-2" onClick={handleAddComment}>
                            Comment
                        </button>
                        <h5 className='mt-2 text-start'>Comments:</h5>
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
        </div>
    )
}
