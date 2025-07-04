import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Modal, Button } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import GoogleMapWithMarker from '../../components/GoogleMapWithMarker';
import Masonry from 'react-masonry-css';
import '../../components/Masonry.css'
import { InlineShareButtons } from 'sharethis-reactjs';
import { useSwipeable } from 'react-swipeable';
import '../../components/PhotoModal.css';
import SwipeablePhotoModal from '../../components/SwipeablePhotoModal';

export default function ViewTrim() {
    const [showModal, setShowModal] = useState(false);
    const [showMapModal, setShowMapModal] = useState(false);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [spots, setSpots] = useState([]);
    const [spotPhotos, setSpotPhotos] = useState([]);
    const [swipeOffset, setSwipeOffset] = useState(0);
    const { user } = useAuth();

    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyContent, setReplyContent] = useState('');
    const [expandedReplies, setExpandedReplies] = useState({});
    const [modelDetails, setModelDetails] = useState(null);

    const breakpointColumnsObj = {
        default: 2,
        1100: 2,
        700: 2,
        500: 2
    };

    const loadModelDetails = async () => {
        try {
            const result = await axios.get(`${process.env.REACT_APP_API_URL}/api/catalog/${make}/${model}`);
            setModelDetails(result.data);
        } catch (error) {
            console.error('Error loading model details:', error);
        }
    };

    const handleOpenModal = (index) => {
        if (spotPhotos && spotPhotos.length > 0) {
            setCurrentPhotoIndex(index);
            setShowModal(true);
            setSwipeOffset(0);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSwipeOffset(0);
    };

    const handleNextPhoto = () => {
        setCurrentPhotoIndex((prevIndex) =>
            prevIndex === spotPhotos.length - 1 ? 0 : prevIndex + 1
        );
        setSwipeOffset(0);

    };

    const handlePrevPhoto = () => {
        setCurrentPhotoIndex((prevIndex) =>
            prevIndex === 0 ? spotPhotos.length - 1 : prevIndex - 1
        );
        setSwipeOffset(0);
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
        productionCount: '',
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
            const result = await axios.get(`${process.env.REACT_APP_API_URL}/api/catalog/${trimId}/spots`);
            setSpots(result.data);
        } catch (error) {
            console.error("Failed to fetch spots", error);
        }
    };

    const fetchSpotPhotos = async () => {
        try {
            const result = await axios.get(`${process.env.REACT_APP_API_URL}/api/catalog/trims/${trimId}/photos`);
            setSpotPhotos(result.data);
            console.log("spotPhotos:", spotPhotos);
        } catch (error) {
            console.error("Failed to fetch photos", error);
        }
    };

    useEffect(() => {
        loadTrim();
        fetchSpots();
        fetchSpotPhotos();
        loadModelDetails();
    }, []);

    const loadTrim = async () => {
        const result = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/catalog/${make}/${model}/${generationId}/${bodystyleId}/${trimId}`);
        setTrim(result.data);
        setComments(result.data.comments);
    }


    const handleAddComment = async () => {
        if (!newComment.trim()) {
            alert('Comment cannot be empty.');
            return;
        }

        try {
            const result = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/trims/${trimId}/comments`,
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
            alert('Error while adding comment.');
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

    const getRarityLabel = (productionCount) => {
        if (productionCount === 1) return { label: "Unique", color: "bg-danger text-white" };
        if (productionCount >= 2 && productionCount <= 10) return { label: "Ultra Exclusive", color: "bg-warning text-dark" };
        if (productionCount >= 11 && productionCount <= 50) return { label: "Super Exclusive", color: "bg-primary text-white" };
        if (productionCount >= 51 && productionCount <= 200) return { label: "Exclusive", color: "bg-success text-white" };
        if (productionCount >= 201 && productionCount <= 500) return { label: "Ultra Rare", color: "bg-info text-dark" };
        if (productionCount >= 501 && productionCount <= 1000) return { label: "Super Rare", color: "bg-secondary text-white" };
        if (productionCount >= 1001 && productionCount <= 5000) return { label: "Rare", color: "bg-dark text-white" };
        if (productionCount >= 5001 && productionCount <= 20000) return { label: "Semi-Mass Produced", color: "bg-light text-dark border" };
        if (productionCount >= 20001 && productionCount <= 1000000) return { label: "Mass Produced", color: "bg-light text-dark border" };
        return { label: "Common", color: "bg-light text-dark border" }; // Default
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
                        <li className="breadcrumb-item"><a href={`/catalog/${make}/${model}`} className="text-decoration-none">{modelDetails?.name}</a></li>
                        <li className="breadcrumb-item"><a href={`/catalog/${make}/${model}/${generationId}`} className="text-decoration-none">{trim.bodystyle.generation?.name}</a></li>
                        <li className="breadcrumb-item"><a href={`/catalog/${make}/${model}/${generationId}/${bodystyleId}`} className="text-decoration-none">{trim.bodystyle.bodytype?.name}</a></li>
                        <li className="breadcrumb-item active" aria-current="page">{trim.name}</li>
                    </ol>
                </nav>
                <div className="d-flex justify-content-between align-items-center border-bottom border-muted mb-3">
                    <div className="h5 text-black text-start">
                        {trim?.altName && trim?.altName !== 'undefined' ? `${make} ${trim.altName}`
                            : `${make} ${modelDetails?.name} ${trim.name}`}
                    </div>


                    <div className='mb-2'>
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
                                    'whatsapp',
                                    'telegram',
                                    'reddit',
                                    'email'
                                ],
                                padding: 10,
                                radius: 10,
                                size: 40,
                            }} />
                    </div>
                </div>

                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3">
                    <div className="col">
                        <div>
                            {spotPhotos.length > 0 && (
                                <img
                                    src={`https://newloripinbucket.s3.amazonaws.com/image/spots/${spotPhotos[0].photoPath}`}
                                    alt="Main"
                                    className="img-fluid mb-3"
                                    onClick={() => handleOpenModal(0)}
                                    style={{ cursor: "pointer", width: "100%" }}
                                />
                            )}
                            <div style={{ columnCount: 3, columnGap: '0.5rem' }}>
                                {spotPhotos.slice(1).map((photo, index) => (
                                    <img
                                        key={index + 1}
                                        src={`https://newloripinbucket.s3.amazonaws.com/image/spots/${photo.photoPath}`}
                                        alt={`Photo ${index + 1}`}
                                        onClick={() => handleOpenModal(index + 1)}
                                        style={{
                                            width: '100%',
                                            height: 'auto',
                                            marginBottom: '0.5rem',
                                            cursor: 'pointer',
                                            display: 'block',
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                        <SwipeablePhotoModal
                            show={showModal}
                            onClose={handleCloseModal}
                            photos={spotPhotos}
                        />
                    </div>
                    <div className="col">
                        <ul className="list-group list-group-flush">

                            {trim.years && (
                                <li className="list-group-item text-start">
                                    Years of production: {trim.years}
                                </li>
                            )}

                            {trim.market && (
                                <li className="list-group-item text-start">
                                    Market: {trim.market?.name}
                                </li>
                            )}

                            {trim.productionCount > 0 && (
                                <li className="list-group-item text-start">

                                    <div className="d-flex justify-content-between align-items-center">
                                        Total produced: {trim.productionCount}

                                        <span className={`badge ms-2 ${getRarityLabel(trim.productionCount).color}`}
                                            style={{ fontSize: "0.9em", padding: "5px 10px", borderRadius: "8px" }}>
                                            {getRarityLabel(trim.productionCount).label}
                                        </span>

                                    </div>

                                </li>
                            )}

                            <li className="list-group-item text-start">
                                {trim.description}
                            </li>

                            {trim.engine && (
                                <li className="list-group-item text-start">
                                    Engine: <Link to={`/engines/${make}/${trim.engine.id}`} className="text-decoration-none">
                                        {trim.engine.name}
                                    </Link>
                                    {(() => {
                                        const parts = [];

                                        if (trim.engine.engineType?.name) parts.push(trim.engine.engineType.name);
                                        if (trim.engine.displacement) parts.push(`${trim.engine.displacement}L`);
                                        if (trim.engine.power) parts.push(`${trim.engine.power} hp`);
                                        if (trim.engine.torque) parts.push(`${trim.engine.torque} Nm`);

                                        if (parts.length === 0) return null;

                                        return <p>{parts.join(', ')}</p>;
                                    })()}
                                </li>
                            )}


                            {trim.transmission && (
                                <li className="list-group-item text-start">
                                    Transmission: <Link to={`/transmissions/${make}/${trim.transmission?.id}`} className="text-decoration-none">{trim.transmission?.name}</Link>
                                    <p>{trim.transmission?.transmissionType?.name}</p>
                                </li>
                            )}

                            {trim.body && (
                                <li className="list-group-item text-start">
                                    Body: <Link to={`/bodies/${make}/${trim.body?.id}`} className="text-decoration-none">{trim.body?.name}</Link>
                                </li>
                            )}

                            {trim.drivetrain && (
                                <li className="list-group-item text-start">
                                    Drivetrain: {trim.drivetrain?.name}
                                </li>
                            )}

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
                        {user?.token ? (
                            <div>
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
                            </div>
                        ) : null}
                        <h5 className='mt-2 text-start'>Comments:</h5>
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
                                                {user?.token ? (
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
                                                ) : null}
                                                {comment.user?.username === user?.username && (
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
                                                                        {reply.user?.username === user?.username && (
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
        </div>
    )
}
