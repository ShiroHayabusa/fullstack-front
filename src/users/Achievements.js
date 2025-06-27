import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Achievements = () => {
    const { type, userId } = useParams(); // type = city | country
    const [currentUser, setCurrentUser] = useState(null);
    const [worldAchievements, setWorldAchievements] = useState([]);
    const [countryAchievements, setCountryAchievements] = useState([]);
    const [regionAchievements, setRegionAchievements] = useState([]);
    const [cityAchievements, setCityAchievements] = useState({});
    const { user } = useAuth();

    const fetchUser = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/${userId}`);
            setCurrentUser(response.data);

        } catch (err) {
            console.error('Error loading user:', err);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    useEffect(() => {
        const loadFirstAchievements = async () => {
            try {
                if (type === "world") {
                    const response = await axios.get(
                        `${process.env.REACT_APP_API_URL}/api/user/${userId}/first-achievements?type=world`,
                        { headers: { Authorization: `Bearer ${user.token}` } }
                    );
                    setWorldAchievements(response.data);
                }

                if (type === "country") {
                    const response = await axios.get(
                        `${process.env.REACT_APP_API_URL}/api/user/${userId}/first-achievements?type=country`,
                        { headers: { Authorization: `Bearer ${user.token}` } }
                    );
                    setCountryAchievements(response.data);
                }

                if (type === "region") {
                    const response = await axios.get(
                        `${process.env.REACT_APP_API_URL}/api/user/${userId}/first-achievements?type=region`,
                        { headers: { Authorization: `Bearer ${user.token}` } }
                    );
                    setRegionAchievements(response.data);
                }

                if (type === "city") {
                    const response = await axios.get(
                        `${process.env.REACT_APP_API_URL}/api/user/${userId}/first-achievements?type=city`,
                        { headers: { Authorization: `Bearer ${user.token}` } }
                    );
                    setCityAchievements(response.data);
                }


            } catch (error) {
                console.error('Error loading first achievements:', error);
            }
        };
        loadFirstAchievements();
    }, [type, user.token]);



    const groupByCategory = (achievements) => {
        const categories = {
            FIRST_SPOT: [],
            FIRST_MAKE: [],
            FIRST_MODEL: [],
            FIRST_GENERATION: [],
            FIRST_TRIM: [],
        };

        achievements.forEach(a => {
            const code = a.achievement?.code || '';
            if (code.startsWith('FIRST_SPOT')) categories.FIRST_SPOT.push(a);
            else if (code.startsWith('FIRST_MAKE')) categories.FIRST_MAKE.push(a);
            else if (code.startsWith('FIRST_MODEL')) categories.FIRST_MODEL.push(a);
            else if (code.startsWith('FIRST_GENERATION')) categories.FIRST_GENERATION.push(a);
            else if (code.startsWith('FIRST_TRIM')) categories.FIRST_TRIM.push(a);
        });

        return categories;
    };

    const handleRecalculate = async () => {
        const confirmed = window.confirm('Are you sure you want to recalculate all user achievements?');

        if (!confirmed) return;

        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/recalculateAchievements`);
            alert('Achievements recalculated successfully!');
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to recalculate achievements.');
        }
    };

    const labels = {
        world: 'First spots in the world',
        country: 'First spots in countries',
        region: 'First spots in regions',
        city: 'First spots in cities'
    };

    return (
        <div>
            {user?.roles.includes("ROLE_ADMIN") && (
                <ul className="nav">
                    <a
                        onClick={handleRecalculate}
                        className="nav-link active"
                        role="button"
                    >
                        Recalculate achievements
                    </a>
                </ul>
            )}
            < div className="container" >
                <nav aria-label="breadcrumb" className='mt-3'>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/" className="text-decoration-none">Home</a></li>
                        <li className="breadcrumb-item"><a href={`/users/${userId}`} className="text-decoration-none">{currentUser?.username}'s userpage</a></li>
                        <li className="breadcrumb-item active" aria-current="page">
                            {labels[type]}
                        </li>
                    </ol>
                </nav>
                <h3 className='text-start'>
                    {labels[type]}:
                </h3>
                <div className="row mt-3">
                    {type === 'world' && worldAchievements.length > 0 && (() => {
                        const grouped = groupByCategory(worldAchievements);
                        return (
                            <div className="mt-3">
                                {Object.entries(grouped).map(([category, items]) =>
                                    items.length > 0 && (
                                        <div key={category} className="mb-4">
                                            <h5 className="text-capitalize text-start">
                                                {category.replace('FIRST_', 'First ').toLowerCase()}
                                            </h5>
                                            <table className="table table-sm">
                                                <tbody>
                                                    {items.map((a, i) => (
                                                        <tr key={i}>
                                                            <td className="text-start">{a.achievement?.name}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )
                                )}
                            </div>
                        );
                    })()}
                    {type === 'city' && cityAchievements.length > 0 && (() => {
                        const grouped = groupByCategory(cityAchievements);
                        return (
                            <div className="mt-3">
                                {Object.entries(grouped).map(([category, items]) =>
                                    items.length > 0 && (
                                        <div key={category} className="mb-4">
                                            <h5 className="text-capitalize text-start">
                                                {category.replace('FIRST_', 'First ').toLowerCase()}
                                            </h5>
                                            <table className="table table-sm">
                                                <tbody>
                                                    {items.map((a, i) => (
                                                        <tr key={i}>
                                                            <td className="text-start">{a.achievement?.name}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )
                                )}
                            </div>
                        );
                    })()}

                    {type === 'country' && countryAchievements.length > 0 && (() => {
                        const grouped = groupByCategory(countryAchievements);
                        return (
                            <div className="mt-3">
                                {Object.entries(grouped).map(([category, items]) =>
                                    items.length > 0 && (
                                        <div key={category} className="mb-4">
                                            <h5 className="text-capitalize text-start">
                                                {category.replace('FIRST_', 'First ').toLowerCase()}
                                            </h5>
                                            <table className="table table-sm">
                                                <tbody>
                                                    {items.map((a, i) => (
                                                        <tr key={i}>
                                                            <td className="text-start">{a.achievement?.name}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )
                                )}
                            </div>
                        );
                    })()}

                    {type === 'region' && regionAchievements.length > 0 && (() => {
                        const grouped = groupByCategory(regionAchievements);
                        return (
                            <div className="mt-3">
                                {Object.entries(grouped).map(([category, items]) =>
                                    items.length > 0 && (
                                        <div key={category} className="mb-4">
                                            <h5 className="text-capitalize text-start">
                                                {category.replace('FIRST_', 'First ').toLowerCase()}
                                            </h5>
                                            <table className="table table-sm">
                                                <tbody>
                                                    {items.map((a, i) => (
                                                        <tr key={i}>
                                                            <td className="text-start">{a.achievement?.name}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )
                                )}
                            </div>
                        );
                    })()}
                </div>
            </div >
        </div>
    );
};

export default Achievements;
