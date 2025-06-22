import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const FollowButton = ({ targetUserId }) => {
    const { user } = useAuth();
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubscriptionStatus = async () => {
            try {
                const res = await axios.get(
                    `${process.env.REACT_APP_API_URL}/api/subscriptions/isSubscribed/${targetUserId}`,
                    { headers: { Authorization: `Bearer ${user.token}` } }
                );
                setIsSubscribed(res.data);
            } catch (err) {
                console.error("Error checking subscription", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSubscriptionStatus();
    }, [targetUserId, user.token]);

    const toggleSubscription = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            if (isSubscribed) {
                await axios.delete(
                    `${process.env.REACT_APP_API_URL}/api/subscriptions/unsubscribe/${targetUserId}`,
                    config
                );
            } else {
                await axios.post(
                    `${process.env.REACT_APP_API_URL}/api/subscriptions/subscribe/${targetUserId}`,
                    {},
                    config
                );
            }
            setIsSubscribed(!isSubscribed);
        } catch (err) {
            console.error("Error toggling subscription", err);
        }
    };

    if (loading) return <button className="bg-gray-300 text-white rounded px-4 py-2">Loading...</button>;

    return (
        <button
            onClick={toggleSubscription}
            className={`btn btn-sm ms-3 ${isSubscribed ? "btn-outline-primary" : "btn-primary"}`}
        >
            {isSubscribed ? "Unfollow" : "Follow"}
        </button>
    );
};

export default FollowButton;
