import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Achievements = () => {
    const { type, userId } = useParams(); // type = city | country
    const [achievements, setAchievements] = useState([]);
    const [cityAchievements, setCityAchievements] = useState({});
    const { user } = useAuth();

    useEffect(() => {
        const loadFirstAchievements = async () => {
            try {
                if (type === "city") {
                    const response = await axios.get(
                        `${process.env.REACT_APP_API_URL}/api/user/profile/first-achievements/grouped?type=city`,
                        { headers: { Authorization: `Bearer ${user.token}` } }
                    );
                    setCityAchievements(response.data);
                } else {
                    const response = await axios.get(
                        `${process.env.REACT_APP_API_URL}/api/user/profile/first-achievements?type=country`,
                        { headers: { Authorization: `Bearer ${user.token}` } }
                    );
                    setAchievements(response.data);
                }
            } catch (error) {
                console.error('Error loading first achievements:', error);
            }
        };

        loadFirstAchievements();
    }, [type, user.token]);

    return (
        <div className="container mt-4">
            <nav aria-label="breadcrumb" className='mt-3'>
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><a href="/" className="text-decoration-none">Home</a></li>
                    <li className="breadcrumb-item"><a href="/user/profile" className="text-decoration-none">Profile</a></li>
                    <li className="breadcrumb-item active" aria-current="page">{type === 'city' ? 'First spots in cities' : 'First spots in countries'}</li>
                </ol>
            </nav>
            <h3 className='text-start'>{type === 'city' ? 'First spots in cities:' : 'First spots in countries:'}</h3>
            <div className="row mt-3">
                {type === 'city' && Object.keys(cityAchievements).length > 0 && (
                    <div className="mt-3">
                        <table className="table table-sm">
                            <tbody>
                                {Object.entries(cityAchievements).map(([country, cities]) => (
                                    <tr key={country} className="align-top">
                                        <td className="fw-bold text-start" style={{ verticalAlign: 'top' }}>
                                            {country}
                                        </td>
                                        <td className="text-start">
                                            {cities
                                                .sort((a, b) => a.localeCompare(b))
                                                .join(', ')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {type === 'country' && achievements.length > 0 && (
                    <div className="mt-3">
                        <table className="table table-sm">
                            <tbody>
                                {achievements.map((achievement, index) => (
                                    <tr key={index} className="align-top">
                                        <td className="text-start" style={{ verticalAlign: 'top' }}>
                                            {achievement.achievement?.name}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Achievements;
