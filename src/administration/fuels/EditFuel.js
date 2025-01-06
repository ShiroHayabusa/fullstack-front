import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function EditFuel() {

    const { id } = useParams(); // Assuming the fuel ID is passed as a route parameter
    let navigate = useNavigate();

    const [fuel, setFuel] = useState({
        name: ""
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        // Fetch the current details of the fuel
        const fetchFuel = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/administration/fuels/${id}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                setFuel({
                    name: response.data.name
                });
            } catch (error) {
                setError('Error fetching fuel details: ' + error.message);
            }
        };

        fetchFuel();
    }, [id]);

    const onInputChange = (e) => {
        setFuel({ ...fuel, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!fuel.name) {
            setError('Please provide a fuel name.');
            return;
        }

        const formData = new FormData();
        formData.append('name', fuel.name);

        try {
            const response = await axios.put(`http://localhost:8080/administration/fuels/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            if (response.status === 200) {
                setSuccess('Fuel updated successfully');
                setError('');
                navigate('/administration/fuels');
            }
        } catch (error) {
            setError('Error updating fuel: ' + error.message);
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
                    <h2 className='text-center m-4'>Edit fuel</h2>
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}
                    <form onSubmit={onSubmit}>
                        <div className='mb-3'>
                            <label htmlFor='Name' className='form-label'>Fuel</label>
                            <input
                                type='text'
                                className='form-control'
                                placeholder='Enter fuel name'
                                name='name'
                                value={fuel.name}
                                onChange={onInputChange}
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
