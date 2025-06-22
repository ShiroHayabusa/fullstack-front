import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import dayjs from 'dayjs';
import { useAuth } from '../context/AuthContext';


const Feed = ({ }) => {
    const { user } = useAuth();
    const [entries, setEntries] = useState([]);
    const [spots, setSpots] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const pageSize = 10;
    const [lastViewedAt, setLastViewedAt] = useState(null);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/api/feed/last-view`, {
            headers: { Authorization: `Bearer ${user.token}` }
        }).then(res => setLastViewedAt(res.data.lastViewedAt));
    }, []);

    const fetchFeed = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/feed/grouped`, {
                params: { page, size: 5 },
                headers: { Authorization: `Bearer ${user.token}` }
            });

            const newEntries = res.data;

            setEntries(prev => {
                const existingKeys = new Set(prev.map(e => e.userId + e.createdAt));
                const filtered = newEntries.filter(e => !existingKeys.has(e.userId + e.createdAt));
                return [...prev, ...filtered];
            });

            setHasMore(newEntries.length > 0);
            setPage(prev => prev + 1);
        } catch (err) {
            console.error("Failed to load feed:", err);
        }
    };


    useEffect(() => {
        fetchFeed();
    }, []);

    useEffect(() => {
        const markFeedAsRead = async () => {
            try {
                await axios.post(`${process.env.REACT_APP_API_URL}/api/feed/mark-as-read`, {}, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
            } catch (err) {
                console.error("Failed to mark feed as read:", err);
            }
        };

        markFeedAsRead();
    }, []);

    return (
        <div className="container">
            <InfiniteScroll
                dataLength={entries.length}
                next={fetchFeed}
                hasMore={hasMore}
            >
                <h3 className="mt-4 mb-3 text-start">Feed</h3>
                {entries.map(entry => (

                    <div key={entry.userId + entry.createdAt}
                        className={`p-3 rounded border-bottom`}
                        style={entry.isNew ? { backgroundColor: '#e6f0f5' } : {}}>
                        <h6 className='text-start'>
                            <Link to={`/users/${entry.userId}`} className="fw-bold text-decoration-none">
                                {entry.username}
                            </Link>{" "}
                            added {entry.spots.length} spot{entry.spots.length !== 1 ? 's' : ''}
                        </h6>

                        <div className="d-flex flex-wrap gap-2">
                            {entry.spots.map(spot => (
                                <Link to={`/spots/${spot.id}`} key={spot.id}>
                                    <img
                                        src={`https://newloripinbucket.s3.amazonaws.com/image/spots/${spot.username}/${spot.id}/${spot.mainPhoto}`}
                                        alt={spot.mainPhoto}
                                        style={{ width: 120, height: 80, objectFit: 'contain' }}
                                        className="rounded shadow-sm"
                                    />
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </InfiniteScroll>
        </div>
    );
};

export default Feed;
