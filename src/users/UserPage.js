import axios from 'axios';
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import Masonry from 'react-masonry-css';
import '../components/Masonry.css'
import FollowButton from '../components/FollowButton';

const UserPage = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [spots, setSpots] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const [message, setMessage] = useState("");
    const [error, setError] = useState(null);
    const [achievements, setAchievements] = useState([]);

    const breakpointColumnsObj = {
        default: 5,
        1100: 4,
        700: 3,
        500: 2
    };

    const [stats, setStats] = useState({
        spots: 0,
        comments: 0,
    });

    const navigate = useNavigate();
    const { user } = useAuth();
    const { userId } = useParams();

    const fetchUser = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/${userId}`);
            setCurrentUser(response.data);

        } catch (err) {
            console.error('Error loading user:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
        setPage(0);
        setSpots([]);
        fetchSpots();
    }, [userId]);

    const fetchSpots = async () => {
        try {
            const result = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/${userId}/userSpots?page=${page}&size=10`);
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

    const loadUserStats = async () => {
        if (!user || !user.token) return;

        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/users/${userId}/stats`,
                {
                    headers: { Authorization: `Bearer ${user.token}` },
                }
            );
            setStats(response.data);

        } catch (error) {
            console.error("Failed to fetch user stats:", error);
        }
    };

    const loadAchievements = async () => {
        const result = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/profile/${userId}/achievements`);
        setAchievements(result.data);
    };

    useEffect(() => {
        if (currentUser) {
            loadUserStats();
            loadAchievements();
        }
    }, [currentUser]);

    if (loading) {
        return <div>Loading...</div>;
    }



    const milestoneAchievements = achievements.filter(a =>
        a.achievement?.code?.startsWith("SPOT_")
    );

    const firstPlaceAchievements = achievements.filter(a =>
        a.achievement?.code?.startsWith("FIRST_IN_CITY") ||
        a.achievement?.code?.startsWith("FIRST_IN_COUNTRY")
    );

    const firstInWorldCount = achievements.filter(a =>
        a.achievement?.code?.startsWith("FIRST_SPOT_WORLD") ||
        a.achievement?.code?.startsWith("FIRST_MAKE_WORLD") ||
        a.achievement?.code?.startsWith("FIRST_MODEL_WORLD") ||
        a.achievement?.code?.startsWith("FIRST_GENERATION_WORLD") ||
        a.achievement?.code?.startsWith("FIRST_TRIM_WORLD")
    ).length;

    const firstInCountryCount = achievements.filter(a =>
        a.achievement?.code?.startsWith("FIRST_SPOT_COUNTRY") ||
        a.achievement?.code?.startsWith("FIRST_MAKE_COUNTRY") ||
        a.achievement?.code?.startsWith("FIRST_MODEL_COUNTRY") ||
        a.achievement?.code?.startsWith("FIRST_GENERATION_COUNTRY") ||
        a.achievement?.code?.startsWith("FIRST_TRIM_COUNTRY")
    ).length;

    const firstInRegionCount = achievements.filter(a =>
        a.achievement?.code?.startsWith("FIRST_SPOT_REGION") ||
        a.achievement?.code?.startsWith("FIRST_MAKE_REGION") ||
        a.achievement?.code?.startsWith("FIRST_MODEL_REGION") ||
        a.achievement?.code?.startsWith("FIRST_GENERATION_REGION") ||
        a.achievement?.code?.startsWith("FIRST_TRIM_REGION")
    ).length;

    const firstInCityCount = achievements.filter(a =>
        a.achievement?.code?.startsWith("FIRST_SPOT_CITY") ||
        a.achievement?.code?.startsWith("FIRST_MAKE_CITY") ||
        a.achievement?.code?.startsWith("FIRST_MODEL_CITY") ||
        a.achievement?.code?.startsWith("FIRST_GENERATION_CITY") ||
        a.achievement?.code?.startsWith("FIRST_TRIM_CITY")
    ).length;

    const worldIconUrl = "https://newloripinbucket.s3.amazonaws.com/image/icons/first_in_world.png";
    const countryIconUrl = "https://newloripinbucket.s3.amazonaws.com/image/icons/first_in_country.png";
    const regionIconUrl = "https://newloripinbucket.s3.amazonaws.com/image/icons/first_in_region.png";
    const cityIconUrl = "https://newloripinbucket.s3.amazonaws.com/image/icons/first_in_city.png";

    return (
        <div className='container'>
            <nav aria-label="breadcrumb" className='mt-3'>
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><a href="/" className="text-decoration-none">Home</a></li>
                    <li className="breadcrumb-item active" aria-current="page">{currentUser?.username}'s userpage</li>
                </ol>
            </nav>
            <div className="h5 pb-1 mb-3 text-black border-bottom text-start d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                    {currentUser?.avatar ? (
                        <img
                            src={`https://newloripinbucket.s3.amazonaws.com/image/users/${currentUser?.username}/${currentUser?.avatar?.name}`}
                            alt="Avatar"
                            className="img-fluid rounded-circle shadow mx-2"
                            style={{ width: '30px', height: '30px', objectFit: 'cover' }}
                        />
                    ) : (
                        <div
                            className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center mx-2"
                            style={{ width: '30px', height: '30px', fontSize: '1rem' }}
                        >
                            {currentUser?.username?.charAt(0).toUpperCase() ?? "?"}
                        </div>
                    )}
                    <span>{currentUser?.username}</span>
                    {user.username !== currentUser.username && (
                        <FollowButton targetUserId={userId} />
                    )}
                </div>
                <span className="d-flex align-items-center text-muted fs-6">
                    {currentUser.rating} pts (
                    <Link to='/profile/leaderboard'
                        className='text-decoration-none'
                    >
                        #{currentUser.ranking}
                    </Link>
                    )
                </span>
            </div>

            <div>
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3">
                    <div className="col">
                        <div className="row">
                            <div className="col text-center">
                                <h5 className="mb-1" style={{ lineHeight: '1.2' }}>{stats.spots}</h5>
                                <div style={{ lineHeight: '1' }}>Spots</div>
                            </div>
                            <div className="col border-start text-center">
                                <h5 className="mb-1" style={{ lineHeight: '1.2' }}>{stats.followers}</h5>
                                <div style={{ lineHeight: '1' }}>Followers</div>
                            </div>
                            <div className="col border-start text-center">
                                <h5 className="mb-1" style={{ lineHeight: '1.2' }}>{stats.subscriptions}</h5>
                                <div style={{ lineHeight: '1' }}>Following</div>
                            </div>
                        </div>
                        <div className='text-center mt-4 mb-3 border-bottom-mobile'>
                            {[currentUser.city, currentUser.region, currentUser.country]
                                .filter(Boolean)
                                .join(', ')}
                            <p></p>
                        </div>

                    </div>

                    <div className="col text-start mb-3 border-start border-bottom-mobile">
                        <h6>Bio</h6>
                        {currentUser?.bio}
                        <p></p>
                    </div>

                    <div className="col text-start border-start">
                        <h6>Achievements</h6>
                        {milestoneAchievements.length > 0 && (
                            <div className="mt-2 d-flex flex-wrap justify-content-center">
                                {milestoneAchievements.map((achievement) => (
                                    <div key={achievement.id} className="text-center me-3 mb-3">
                                        <div className="d-flex flex-column align-items-center">
                                            <img
                                                src={`https://newloripinbucket.s3.amazonaws.com/image/${achievement.achievement?.iconUrl}`}
                                                style={{ width: 'auto', height: '75px' }}
                                                alt={`${achievement.achievement?.name} logo`}
                                                className='img-fluid'
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {(firstInWorldCount > 0 || firstInCountryCount > 0 || firstInRegionCount > 0 || firstInCityCount > 0) && (
                            <div className="d-flex flex-wrap justify-content-center border-top pt-3">
                                {firstInWorldCount > 0 && (
                                    <div className="text-center me-3 mb-3">
                                        <Link to={`/achievements/world/${userId}`} className="text-decoration-none text-dark">
                                            <div className="d-flex flex-column align-items-center">
                                                <img
                                                    src={worldIconUrl}
                                                    style={{ width: 'auto', height: '75px' }}
                                                    alt="First in World"
                                                    className='img-fluid'
                                                />
                                                <div className="text-muted fw-bold fs-5">{firstInWorldCount}</div>
                                            </div>
                                        </Link>
                                    </div>
                                )}
                                {firstInCountryCount > 0 && (
                                    <div className="text-center me-3 mb-3">
                                        <Link to={`/achievements/country/${userId}`} className="text-decoration-none text-dark">
                                            <div className="d-flex flex-column align-items-center">
                                                <img
                                                    src={countryIconUrl}
                                                    style={{ width: 'auto', height: '75px' }}
                                                    alt="First in Country"
                                                    className='img-fluid'
                                                />
                                                <div className="text-muted fw-bold fs-5">{firstInCountryCount}</div>
                                            </div>
                                        </Link>
                                    </div>
                                )}
                                {firstInRegionCount > 0 && (
                                    <div className="text-center me-3 mb-3">
                                        <Link to={`/achievements/region/${userId}`} className="text-decoration-none text-dark">
                                            <div className="d-flex flex-column align-items-center">
                                                <img
                                                    src={regionIconUrl}
                                                    style={{ width: 'auto', height: '75px' }}
                                                    alt="First in Region"
                                                    className='img-fluid'
                                                />
                                                <div className="text-muted fw-bold fs-5">{firstInRegionCount}</div>
                                            </div>
                                        </Link>
                                    </div>
                                )}
                                {firstInCityCount > 0 && (
                                    <div className="text-center me-3 mb-3">
                                        <Link to={`/achievements/city/${userId}`} className="text-decoration-none text-dark">
                                            <div className="d-flex flex-column align-items-center">
                                                <img
                                                    src={cityIconUrl}
                                                    style={{ width: 'auto', height: '75px' }}
                                                    alt="First in City"
                                                    className='img-fluid'
                                                />
                                                <div className="text-muted fw-bold fs-5">{firstInCityCount}</div>
                                            </div>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="h5 pb-1 mb-3 text-black border-bottom text-start">
                {currentUser?.username}'s spots
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
                                src={`https://newloripinbucket.s3.amazonaws.com/image/spots/${spot.user?.username}/${spot.id}/${spot.photos?.find(photo => photo.isMain)?.name}`}
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
