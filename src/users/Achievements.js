import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Achievements = () => {
    const { type, userId } = useParams(); // type = city | country
    const [countryAchievements, setCountryAchievements] = useState([]);
    const [cityAchievements, setCityAchievements] = useState({});
    const { user } = useAuth();

    useEffect(() => {
        const loadFirstAchievements = async () => {
            try {
                if (type === "city") {
                    const response = await axios.get(
                        `${process.env.REACT_APP_API_URL}/api/user/profile/first-achievements?type=city`,
                        { headers: { Authorization: `Bearer ${user.token}` } }
                    );
                    setCityAchievements(response.data);
                } else {
                    const response = await axios.get(
                        `${process.env.REACT_APP_API_URL}/api/user/profile/first-achievements?type=country`,
                        { headers: { Authorization: `Bearer ${user.token}` } }
                    );
                    setCountryAchievements(response.data);
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
                        <li className="breadcrumb-item"><a href="/user/profile" className="text-decoration-none">Profile</a></li>
                        <li className="breadcrumb-item active" aria-current="page">
                            {type === 'city' ? 'First spots in cities' : 'First spots in countries'}
                        </li>
                    </ol>
                </nav>
                <h3 className='text-start'>
                    {type === 'city' ? 'First spots in cities:' : 'First spots in countries:'}
                </h3>
                <div className="row mt-3">
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
                </div>
            </div >
        </div>
    );
};

export default Achievements;
