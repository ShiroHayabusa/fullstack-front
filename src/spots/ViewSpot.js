import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Loader } from '@googlemaps/js-api-loader';
import { Modal, Button } from 'react-bootstrap';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import GoogleMapWithMarker from '../components/GoogleMapWithMarker';
import { InlineShareButtons } from 'sharethis-reactjs';
import { useSwipeable } from 'react-swipeable';


export default function ViewSpot() {
    const [spot, setSpot] = useState({ caption: '', photos: [], latitude: null, longitude: null });

    const { id } = useParams();
    const mapContainerRef = useRef(null);
    const navigate = useNavigate();
    const { user } = useAuth();

    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyContent, setReplyContent] = useState('');
    const [expandedReplies, setExpandedReplies] = useState({});

    const [likes, setLikes] = useState(0);
    const [hasLiked, setHasLiked] = useState(false);



    const loadSpot = async () => {
        try {
            const headers = user?.token
                ? { Authorization: `Bearer ${user.token}` }
                : {};
            const result = await axios.get(`${process.env.REACT_APP_API_URL}/api/spots/${id}`, {
                headers,
            });
            setSpot(result.data);

            setComments(result.data.comments);
            const likesResult = await axios.get(`${process.env.REACT_APP_API_URL}/api/spots/${id}/likes`, {
                headers,
            });
            setLikes(likesResult.data.likeCount);
            setHasLiked(likesResult.data.hasLiked);
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
        }
    };



    useEffect(() => {
        loadSpot();
    }, []);

    const [showModal, setShowModal] = useState(false);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

    const handleOpenModal = (index) => {
        setCurrentPhotoIndex(index);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
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

    const swipeHandlers = useSwipeable({
        onSwipedLeft: () => handleNextPhoto(),
        onSwipedRight: () => handlePrevPhoto(),
         delta: 10, 
         preventDefaultTouchmoveEvent: true,
         trackTouch: true,
         trackMouse: true, 
    });

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
                await axios.delete(`${process.env.REACT_APP_API_URL}/api/spots/deleteSpot/${id}`, {
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
            alert('Comment cannot be empty.');
            return;
        }

        try {
            const result = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/spots/${id}/addComment`,
                { content: newComment },
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                }
            );
            setComments((prevComments) => [result.data, ...prevComments]);
            setNewComment('');
        } catch (error) {
            console.error('Error adding comment:', error);
            alert('Failed to add comment.');
        }
    };

    const handleReplyClick = (commentId) => {
        setReplyingTo((prev) => (prev === commentId ? null : commentId));
    };


    const toggleReplies = (commentId) => {
        setExpandedReplies((prev) => ({
            ...prev,
            [commentId]: !prev[commentId],
        }));
    };

    const handleAddReply = async (parentId) => {
        if (!replyContent.trim()) {
            alert('Reply cannot be empty.');
            return;
        }

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/comments/${parentId}/replies`,
                { content: replyContent },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );


            setComments((prevComments) =>
                prevComments.map((comment) =>
                    comment.id === parentId
                        ? { ...comment, replies: [response.data, ...(comment.replies || [])] }
                        : comment
                )
            );


            setExpandedReplies((prev) => ({
                ...prev,
                [parentId]: true,
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
                `${process.env.REACT_APP_API_URL}/api/spots/${id}/like`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                }
            );
            setLikes(response.data.likeCount);
            setHasLiked(response.data.hasLiked);
        } catch (error) {
            console.error('Like switching error:', error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this comment?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/api/comments/${commentId}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });

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
            await axios.delete(`${process.env.REACT_APP_API_URL}/api/comments/${commentId}/replies/${replyId}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });

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
                        <InlineShareButtons
                            config={{
                                color: 'social',
                                enabled: true,
                                font_size: 14,
                                labels: 'null',
                                language: 'en',
                                networks: [
                                    'facebook',
                                    'twitter',
                                    'reddit',
                                    'email'
                                ],
                                padding: 10,
                                radius: 10,
                                size: 40,
                            }} />
                    </div>
                </div>
                {user?.username === spot.user?.username && (
                    <ul className="nav mt-3 mb-3" style={{ display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
                        <li className="nav-item">
                            <button
                                className="btn btn-link text-decoration-none text-primary"
                                onClick={() => navigate(`/spots/editSpot/${id}`)}
                                style={{ fontSize: "16px", padding: 0 }}
                            >
                                Edit Spot
                            </button>
                        </li>

                        <li className="nav-item ms-3">
                            <button
                                onClick={deleteSpot}
                                className="d-flex align-items-center"
                                style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    color: "red",
                                }}
                            >
                                <i className="bi bi-trash" style={{ fontSize: "20px" }}></i>
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
                                        src={`https://newloripinbucket.s3.amazonaws.com/image/spots/${spot.user?.username}/${spot.id}/${photo.name}`}
                                        alt={photo.name}
                                        className="img-fluid mb-2"
                                        onClick={() => handleOpenModal(index)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    <Modal
                        show={showModal}
                        onHide={handleCloseModal}
                        size="lg"
                    >

                        <Modal.Body {...swipeHandlers}>
                            <div className="d-flex justify-content-center">
                                <img
                                    src={`https://newloripinbucket.s3.amazonaws.com/image/spots/${spot.user?.username}/${spot.id}/${spot.photos[currentPhotoIndex]?.name}`}
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
                            <div className="d-flex align-items-center">
                                <span className="me-2">Spotted by</span>
                                <Link
                                    to={`/users/${spot.user?.id}`}
                                    className="d-flex align-items-center text-decoration-none text-black"
                                >
                                    {spot.user?.avatar ? (
                                        <img
                                            src={`https://newloripinbucket.s3.amazonaws.com/image/users/${spot.user.username}/${spot.user?.avatar.name}`}
                                            alt="Avatar"
                                            className="img-fluid rounded-circle me-2"
                                            style={{ width: '30px', height: '30px', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <div
                                            className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center me-2"
                                            style={{ width: '30px', height: '30px', fontSize: '1rem' }}
                                        >
                                            {spot.user?.username.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <span>{spot.user?.username}</span>
                                </Link>
                            </div>
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
                                {user?.token ? (
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
                                ) : null}
                                <h5 className='text-start mt-3'>Comments:</h5>
                                <ul className="list-group list-group-flush text-start">
                                    {comments.map((comment) => (
                                        <li key={comment.id} className="list-group-item py-2">
                                            <div className="d-flex">

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

                                                    <span className="d-flex justify-content-between align-items-center">
                                                        <strong>{comment.user.username}</strong>
                                                        <span className="text-muted small">
                                                            {comment?.createdAt
                                                                ? `${formatDistanceToNow(new Date(comment.createdAt)).replace('about ', '')}`
                                                                : 'Unknown'}
                                                        </span>
                                                    </span>

                                                    <p className="mb-0">{comment.content}</p>

                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <button
                                                            className="btn btn-sm btn-link text-muted p-0 mt-1 text-decoration-none"
                                                            style={{
                                                                fontSize: '12px',
                                                                alignSelf: 'start',
                                                            }}
                                                            onClick={() => handleReplyClick(comment.id)}
                                                        >
                                                            {replyingTo === comment.id ? 'Cancel' : 'Reply'}
                                                        </button>
                                                        {comment?.user?.username === user?.username && (
                                                            <button
                                                                className="btn btn-sm btn-link text-muted p-0"
                                                                style={{
                                                                    fontSize: '12px',
                                                                    alignSelf: 'start',
                                                                }}
                                                                onClick={() => handleDeleteComment(comment.id)}
                                                            >
                                                                <i className="bi bi-trash"></i>
                                                            </button>
                                                        )}
                                                    </div>

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

                                                    {comment.replies && comment.replies.length > 0 && (
                                                        <button
                                                            className="btn btn-link p-0 mt-1 text-decoration-none"
                                                            style={{
                                                                fontSize: '12px',
                                                                alignSelf: 'start',
                                                            }}
                                                            onClick={() => toggleReplies(comment.id)}
                                                        >
                                                            {expandedReplies[comment.id] ? 'Hide Replies' : 'View Replies'}
                                                        </button>
                                                    )}

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
                                                                                {reply.user.username === user.username && (
                                                                                    <button
                                                                                        className="btn btn-sm btn-link text-muted p-0"
                                                                                        style={{
                                                                                            fontSize: '12px',
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
                                {spot?.city}, {spot?.country}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
