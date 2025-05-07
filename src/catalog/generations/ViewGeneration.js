import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Masonry from 'react-masonry-css';
import '../../components/Masonry.css'
import VideoList from '../../components/VideoList';

export default function ViewGeneration() {
    const [bodystyles, setBodystyles] = useState([]);
    const [facelifts, setFacelifts] = useState([]);
    const [generation, setGeneration] = useState({
        name: ''
    });

    const { make, model, generationId } = useParams();

    const [spots, setSpots] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const navigate = useNavigate();
    const { user } = useAuth();

    const [youtubeUrl, setYoutubeUrl] = useState('');
    const [inputVisible, setInputVisible] = useState(false);
    const [videos, setVideos] = useState([]);
    const [activeTab, setActiveTab] = useState("spots");

    const breakpointColumnsObj = {
        default: 5,
        1100: 4,
        700: 3,
        500: 2
    };

    useEffect(() => {
        const loadData = async () => {
            await Promise.all([loadFacelifts(), loadBodystyles(), loadGeneration()]);
            loadVideos();
        };
        loadData();
        fetchSpots();
    }, []);

    const loadFacelifts = async () => {
        const result = await axios.get(`${process.env.REACT_APP_API_URL}/api/catalog/${make}/${model}/${generationId}/faceliftList`);
        setFacelifts(result.data);
    };

    const loadBodystyles = async () => {
        const result = await axios.get(`${process.env.REACT_APP_API_URL}/api/catalog/${make}/${model}/${generationId}/bodystyles`);
        setBodystyles(result.data);
    };

    const loadGeneration = async () => {
        const result = await axios.get(`${process.env.REACT_APP_API_URL}/api/catalog/${make}/${model}/${generationId}`);
        setGeneration(result.data);
    };

    const fetchSpots = async () => {
        try {
            const result = await axios.get(`${process.env.REACT_APP_API_URL}/api/spots/${generationId}/generationSpots?page=${page}&size=10`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            setSpots((prevSpots) => {
                const newSpots = result.data.content.filter(
                    (newSpot) => !prevSpots.some((spot) => spot.id === newSpot.id)
                );
                return [...prevSpots, ...newSpots];
            });
            setHasMore(result.data.totalPages > page + 1);
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

    const handleAddVideo = async (isCommercial) => {
        const id = extractVideoId(youtubeUrl);
        if (id) {
            try {
                const videoDTO = {
                    youtubeId: id,
                    generationId: generationId,
                    isCommercial: isCommercial
                };

                const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/addVideo`, videoDTO, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                        'Content-Type': 'application/json'
                    }
                });

                setVideos(prev => [...prev, response.data]);
                setYoutubeUrl('');
                setInputVisible(false);
            } catch (error) {
                console.error('Failed to add video:', error);
                alert('Error adding video');
            }
        } else {
            alert('Invalid YouTube link');
        }
    };


    const loadVideos = async () => {
        try {
            const result = await axios.get(`${process.env.REACT_APP_API_URL}/api/videos/generation/${generationId}`);
            setVideos(result.data);
        } catch (error) {
            console.error('Failed to load videos:', error);
        }
    };


    const extractVideoId = (url) => {
        const regExp = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^\s&]+)/;
        const match = url.match(regExp);
        return match ? match[1] : null;
    };


    useEffect(() => {
        const tabElements = document.querySelectorAll('button[data-bs-toggle="tab"]');
        const handleTabChange = (e) => {
            const targetId = e.target.getAttribute('data-bs-target');
            if (targetId === '#comm-tab-pane') {
                setActiveTab('commercials');
            } else if (targetId === '#video-tab-pane') {
                setActiveTab('videos');
            } else if (targetId === '#spots-tab-pane') {
                setActiveTab('spots');
            }
        };

        tabElements.forEach(el => el.addEventListener('shown.bs.tab', handleTabChange));

        return () => {
            tabElements.forEach(el => el.removeEventListener('shown.bs.tab', handleTabChange));
        };
    }, []);

    return (
        <div>
            {user?.roles.includes("ROLE_ADMIN") && (
                <ul className="nav">
                    <Link className="nav-link active" aria-current="page" to={`/catalog/${make}/${model}/${generationId}/addFacelift`}>Add facelift</Link>
                    <Link className="nav-link active" aria-current="page" to={`/catalog/${make}/${model}/${generationId}/addBodystyle`}>Add bodystyle</Link>
                    <Link className="nav-link active" aria-current="page" to={`/catalog/${make}/${model}/${generationId}/editGeneration`}>Edit generation</Link>
                </ul>
            )}
            <div className='container'>
                <nav aria-label="breadcrumb" className='mt-3'>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/" className="text-decoration-none">Home</a></li>
                        <li className="breadcrumb-item"><a href="/catalog" className="text-decoration-none">Catalog</a></li>
                        <li className="breadcrumb-item"><a href={`/catalog/${make}`} className="text-decoration-none">{make}</a></li>
                        <li className="breadcrumb-item"><a href={`/catalog/${make}/${model}`} className="text-decoration-none">{model}</a></li>
                        <li className="breadcrumb-item active" aria-current="page">{generation.name}</li>
                    </ol>
                </nav>
                <div className="row row-cols-1 row-cols-md-3 mb-3">
                    <div className="col-md-3 mb-3 text-start">
                        <h5>{make} {model}</h5>
                        <h5>{generation.name}</h5>
                        <span>{generation?.years}</span>
                        {generation.bodies && generation.bodies.length > 0 && (
                            <div>
                                {generation.bodies.map((body, index) => (
                                    <span key={body.id}>
                                        {body.name}{index < generation.bodies.length - 1 && ', '}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="col-md-9">
                        <p className="text-start">{generation?.description}</p>
                    </div>
                </div>
                {facelifts.map((facelift) => (
                    <div className="mt-3" key={facelift.id}>
                        <div className="h5 pb-1 text-black border-bottom border-muted text-start">
                            <div className="h5 col-md-5 text-start">
                                {facelift.name}
                                {user?.roles.includes("ROLE_ADMIN") && (
                                    <Link to={`/catalog/${make}/${model}/${generationId}/${facelift.id}/editFacelift`} className="ms-3 text-decoration-none">Edit facelift</Link>
                                )}
                            </div>
                        </div>

                        <div className="row row-cols-1 row-cols-md-3 g-3">
                            {bodystyles.filter(bodystyle => bodystyle.facelift.name === facelift.name).map((bodystyle) => (
                                <div className="col" key={bodystyle.id}>
                                    <Link to={`/catalog/${make}/${model}/${generationId}/${bodystyle.id}`} className="text-decoration-none text-black">
                                        <div className="card">
                                            <img
                                                src={
                                                    bodystyle?.photoName
                                                        ? `https://newloripinbucket.s3.amazonaws.com/image/spots/${bodystyle.spotUser}/${bodystyle.spotId}/${bodystyle.photoName}`
                                                        : 'https://newloripinbucket.s3.amazonaws.com/image/placeholder_400x400.png'
                                                }
                                                className="card-img-top"
                                                alt={bodystyle.name}
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

                <ul className="nav nav-tabs mt-3" id="myTab" role="tablist">
                    <li class="nav-item" role="presentation">
                        <button
                            class="nav-link active"
                            id="spots-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#spots-tab-pane"
                            type="button"
                            role="tab"
                            aria-controls="spots-tab-pane"
                            aria-selected="true">
                            Spots
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button
                            class="nav-link"
                            id="comm-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#comm-tab-pane"
                            type="button"
                            role="tab"
                            aria-controls="comm-tab-pane"
                            aria-selected="false"
                        >
                            Commercials
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button
                            class="nav-link"
                            id="video-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#video-tab-pane"
                            type="button" role="tab"
                            aria-controls="video-tab-pane"
                            aria-selected="false"
                        >
                            Videos
                        </button>
                    </li>
                </ul>
                <div class="tab-content" id="myTabContent">
                    <div
                        className="tab-pane fade show active mt-3"
                        id="spots-tab-pane"
                        role="tabpanel"
                        aria-labelledby="spots-tab"
                        tabindex="0">
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
                                            alt={spot.photos?.find(photo => photo.isMain)?.name}
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
                    <div
                        class="tab-pane fade"
                        id="comm-tab-pane"
                        role="tabpanel"
                        aria-labelledby="comm-tab"
                        tabindex="0"
                    >
                        {user?.token ? (
                            <ul className="nav" style={{ display: "flex", alignItems: "center" }}>
                                <li className="nav-item">
                                    <button
                                        className="btn btn-outline-primary mt-3 mb-3"
                                        onClick={() => setInputVisible(!inputVisible)}
                                    >
                                        {inputVisible ? 'Cancel' : 'Add commercial'}
                                    </button>
                                </li>
                            </ul>
                        ) : null}
                        {inputVisible && (
                            <div className="d-flex align-items-center gap-2 mb-3">
                                <input
                                    type="text"
                                    placeholder="Youtube Link"
                                    value={youtubeUrl}
                                    onChange={(e) => setYoutubeUrl(e.target.value)}
                                    className="form-control"
                                    style={{ maxWidth: '400px' }}
                                />
                                <button className="btn btn-success" onClick={() => handleAddVideo(true)}>
                                    Add
                                </button>
                            </div>
                        )}
                        <VideoList videos={videos.filter(video => video.isCommercial)} />
                    </div>
                    <div
                        class="tab-pane fade"
                        id="video-tab-pane"
                        role="tabpanel"
                        aria-labelledby="video-tab"
                        tabindex="0"

                    >
                        {user?.token ? (
                            <ul className="nav" style={{ display: "flex", alignItems: "center" }}>
                                <li className="nav-item">
                                    <button
                                        className="btn btn-outline-primary mt-3 mb-3"
                                        onClick={() => setInputVisible(!inputVisible)}
                                    >
                                        {inputVisible ? 'Cancel' : 'Add video'}
                                    </button>
                                </li>
                            </ul>
                        ) : null}
                        {inputVisible && (
                            <div className="d-flex align-items-center gap-2 mb-3">
                                <input
                                    type="text"
                                    placeholder="Youtube Link"
                                    value={youtubeUrl}
                                    onChange={(e) => setYoutubeUrl(e.target.value)}
                                    className="form-control"
                                    style={{ maxWidth: '400px' }}
                                />
                                <button className="btn btn-success" onClick={() => handleAddVideo(false)}>
                                    Add
                                </button>
                            </div>
                        )}
                        <VideoList videos={videos.filter(video => !video.isCommercial)} />
                    </div>

                </div>
            </div>
        </div>
    );
}
