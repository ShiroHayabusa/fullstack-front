import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AddMarket() {

    let navigate = useNavigate();

    const [countryList, setCountryList] = useState([]);
    const [market, setMarket] = useState({
        name: "",
        country: ""
    });

    const { name } = market;
    const { user } = useAuth();

    const onInputChange = (e) => {
        setMarket({ ...market, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', market.name);
        formData.append('country', market.country);
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/markets/addMarket`, formData, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            if (response.status === 200 || response.status === 201) {
                console.log('Market added successfully');
                navigate('/admin/markets');
            }
        } catch (error) {
            console.error('Error adding market: ', error);
        }
    };

    const fetchCountries = () => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/api/admin/countries`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            })
            .then((response) => {
                const { data } = response;
                if (response.status === 200) {
                    setCountryList(data)
                } 
            })
            .catch((error) => console.log(error));
    };

    useEffect(() => {
        fetchCountries()
    }, [])

    return (
        <div className='container'>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb mt-3">
                    <li className="breadcrumb-item"><a href="/" className="text-decoration-none">Home</a></li>
                    <li className="breadcrumb-item"><a href="/admin" className="text-decoration-none">Administration</a></li>
                    <li className="breadcrumb-item"><a href="/admin/markets" className="text-decoration-none">Markets</a></li>
                    <li className="breadcrumb-item active" aria-current="page">Add market</li>

                </ol>
            </nav>
            <div className='row'>
                <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow'>
                    <h2 className='text-center m-4'>Add market</h2>
                    <form onSubmit={(e) => onSubmit(e)}>
                        <div className='mb-3'>
                            <label htmlFor='Name' className='form-label'>Market</label>
                            <input
                                type={'text'}
                                className='form-control'
                                placeholder='Enter market'
                                name='name'
                                value={name}
                                onChange={(e) => onInputChange(e)}
                            />
                        </div>
                        <select onChange={onInputChange} name="country" className="form-select mt-3 mb-3">
                            <option value={"default"}>
                                Select country
                            </option>
                            {countryList.map((country) => (
                                <option key={country.id} value={country.id} >
                                    {country.name}
                                </option>
                            ))}
                        </select>
                        <button type='submit' className="btn btn-outline-primary">Submit</button>
                        <Link className="btn btn-outline-danger mx-2" to={`/admin/markets`}>Cancel</Link>
                    </form>
                </div>
            </div>
        </div>
    )
}
