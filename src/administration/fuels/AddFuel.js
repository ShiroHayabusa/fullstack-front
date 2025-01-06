import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AddFuel() {

    let navigate = useNavigate();

    const [fuel, setFuel] = useState({
        name: ""
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const { name } = fuel;
    const { user } = useAuth();

    const onInputChange = (e) => {
        setFuel({ ...fuel, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!name) {
            setError('Please provide a fuel name');
            return;
        }
        const formData = new FormData();
        formData.append('name', fuel.name);
        try {
            const response = await axios.post('http://localhost:8080/administration/fuels/addFuel', formData, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            if (response.status === 200 || response.status === 201) {
                setSuccess('Fuel added successfully');
                setError('');
                setFuel({ name: "" });
                navigate('/administration/fuels');
            }
        } catch (error) {
            console.error('Error adding fuel: ', error.message);
        }
    };

    return (
        <div className='container'>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb mt-3">
                    <li className="breadcrumb-item"><a href="/" className="text-decoration-none">Home</a></li>
                    <li className="breadcrumb-item"><a href='/administration' className="text-decoration-none">Administration</a></li>
                    <li className="breadcrumb-item"><a href='/administration/fuels' className="text-decoration-none">Fuels</a></li>
                    <li className="breadcrumb-item active" aria-current="page">Add fuel</li>
                </ol>
            </nav>
            <div className='row'>
                <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow'>
                    <h2 className='text-center m-4'>Add fuel</h2>
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}
                    <form onSubmit={(e) => onSubmit(e)}>
                        <div className='mb-3'>
                            <label htmlFor='Name' className='form-label'>Fuel</label>
                            <input
                                type={'text'}
                                className='form-control'
                                placeholder='Enter fuel name'
                                name='name'
                                value={name}
                                onChange={(e) => onInputChange(e)}
                            />
                        </div>
                        <button type='submit' className="btn btn-outline-primary">Submit</button>
                        <Link className="btn btn-outline-danger mx-2" to={`/administration/fuels`}>Cancel</Link>
                    </form>
                </div>
            </div>
        </div>
    )
}
