import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

export default function EditMarket() {
    let navigate = useNavigate();
    let { id } = useParams();

    const [market, setMarket] = useState({
        name: "",
        country: { id: null }
    });
    const [countryList, setCountryList] = useState([]);

    useEffect(() => {
        loadMarket();
        fetchCountries();
    }, []);

    const loadMarket = async () => {
        const result = await axios.get(`http://localhost:8080/administration/markets/updateMarket/${id}`);
        setMarket(result.data);
    };

    const fetchCountries = async () => {
        const result = await axios.get('http://localhost:8080/administration/countries');
        setCountryList(result.data);
    };

    const onInputChange = (e) => {
        setMarket({ ...market, [e.target.name]: e.target.value });
    };

    const onCountryChange = (e) => {
        setMarket({ ...market, country: { id: e.target.value } });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8080/administration/markets/updateMarket/${id}`, market, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            navigate('/administration/markets');
        } catch (error) {
            console.error('Error updating market:', error);
        }
    };

    return (
        <div className='container'>
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><a href="/">Home</a></li>
                    <li class="breadcrumb-item"><a href='/administration'>Administration</a></li>
                    <li class="breadcrumb-item active" aria-current="page">Markets</li>

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
                    <select name='country' className='form-select' onChange={onCountryChange} value={market.country.id}>
                        <option value={null}>Select country</option>
                        {countryList.map(country => (
                            <option key={country.id} value={country.id}>{country.name}</option>
                        ))}
                    </select>
                </div>
                <button type='submit' className='btn btn-primary'>Submit</button>
                <button onClick={() => navigate('/administration/markets')} className='btn btn-danger mx-2'>Cancel</button>
            </form>
        </div>
    );
}
