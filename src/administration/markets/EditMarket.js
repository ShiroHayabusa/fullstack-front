import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function EditMarket() {
    let navigate = useNavigate();
    let { id } = useParams();

    const [market, setMarket] = useState({
        name: '',
        country: ''
    });
    const [countryList, setCountryList] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        loadMarket();
        fetchCountries();
    }, []);

    const loadMarket = async () => {
        const result = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/markets/updateMarket/${id}`, {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        });
        setMarket({
            name: result.data.name,
            country: result.data.country?.id
        });
    };

    const fetchCountries = async () => {
        const result = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/countries`, {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        });
        setCountryList(result.data);
    };

    const onInputChange = (e) => {
        setMarket({ ...market, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!market.name) {
            setError('Please provide a market name.');
            return;
        }

        const formData = new FormData();
        Object.keys(market).forEach(key => {
            formData.append(key, market[key]);
        });

        if (market.country) {
            formData.append('countryId', market.country);
        }

        try {
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/admin/markets/${id}/editMarket`, formData, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            if (response.status === 200) {
                setSuccess('Market updated successfully');
                setError('');
                navigate(`/admin/markets`);
            }
        } catch (error) {
            setError('Error updating market: ' + error.message);
        }
    };

    return (
        <div className='container'>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb mt-3">
                    <li className="breadcrumb-item"><a href="/" className="text-decoration-none">Home</a></li>
                    <li className="breadcrumb-item"><a href='/admin' className="text-decoration-none">Administration</a></li>
                    <li className="breadcrumb-item active" aria-current="page">Markets</li>

                </ol>
            </nav>
            <h2>Edit Market</h2>
            <form onSubmit={(e) => onSubmit(e)}>
                <div className='mb-3'>
                    <label htmlFor='name' className='form-label'>Name</label>
                    <input
                        type='text'
                        className='form-control'
                        placeholder='Enter market name'
                        name='name'
                        value={market.name}
                        onChange={(e) => onInputChange(e)}
                    />
                </div>
                <div className='mb-3'>
                    <label htmlFor='country' className='form-label'>Country</label>
                    <select
                        name='country'
                        className='form-select'
                        onChange={onInputChange}
                        value={market.country}>
                        <option value={"default"}>
                            Select country
                        </option>
                        {countryList.map(country => (
                            <option
                                key={country.id}
                                value={country.id}>
                                {country.name}
                            </option>
                        ))}
                    </select>
                </div>
                <button type='submit' className='btn btn-primary'>Submit</button>
                <button onClick={() => navigate('/admin/markets')} className='btn btn-danger mx-2'>Cancel</button>
            </form>
        </div>
    );
}
