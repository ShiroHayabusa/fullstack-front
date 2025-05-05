import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom';

export default function Leaderboard() {

    const [leaderboard, setLeaderboard] = useState([]);

    const loadLeaderboard = async () => {
        try {
            const result = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/leaderboard`);
            setLeaderboard(result.data);
        } catch (error) {
            console.error("Failed to fetch leaderboard", error);
        }
    };

    useEffect(() => {
        loadLeaderboard();
    }, []);

    return (
        <div>
            <div className='container'>
                <nav aria-label="breadcrumb" className='mt-3'>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/" className="text-decoration-none">Home</a></li>
                        <li className="breadcrumb-item"><a href="/user/profile" className="text-decoration-none">Profile</a></li>
                        <li className="breadcrumb-item active" aria-current="page">Leaderboard</li>
                    </ol>
                </nav>
                <div className="col-md-3 text-start mb-3">
                    <h5 className="text-start">🏆 Leaderboard</h5>
                    <ul className="list-group list-group-flush">
                        {leaderboard.map((user, index) => (
                            <li key={user.id} className="list-group-item d-flex justify-content-between align-items-center">
                                <div>
                                    {index + 1}.
                                    <Link to={`/users/${user.id}`} className="text-decoration-none ms-2">
                                        {user.username}
                                    </Link>
                                </div>
                                <span>{user.rating} pts</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>

    )
}
