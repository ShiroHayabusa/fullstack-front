import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function EditTransmissionType() {

    const { id } = useParams(); 
    let navigate = useNavigate();

    const [transmissionType, setTransmissionType] = useState({
        name: ""
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        const fetchTransmissionType = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/transmissionTypes/${id}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                setTransmissionType({
                    name: response.data.name
                });
            } catch (error) {
                setError('Error fetching transmissionType details: ' + error.message);
            }
        };

        fetchTransmissionType();
    }, [id]);

    const onInputChange = (e) => {
        setTransmissionType({ ...transmissionType, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!transmissionType.name) {
            setError('Please provide a transmissionType name.');
            return;
        }

        const formData = new FormData();
        formData.append('name', transmissionType.name);

        try {
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/admin/transmissionTypes/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            if (response.status === 200) {
                setSuccess('Transmission type updated successfully');
                setError('');
                navigate('/admin/transmissionTypes');
            }
        } catch (error) {
            setError('Error updating transmissionType: ' + error.message);
        }
    };

    return (
        <div className='container'>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb mt-3">
                    <li className="breadcrumb-item"><a href="/" className="text-decoration-none">Home</a></li>
                    <li className="breadcrumb-item"><a href='/admin' className="text-decoration-none">Administration</a></li>
                    <li className="breadcrumb-item"><a href='/admin/transmissionTypes' className="text-decoration-none">Transmission types</a></li>
                    <li className="breadcrumb-item active" aria-current="page">Edit transmission type</li>
                </ol>
            </nav>
            <div className='row'>
                <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow'>
                    <h2 className='text-center m-4'>Edit transmission type</h2>
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}
                    <form onSubmit={onSubmit}>
                        <div className='mb-3'>
                            <label htmlFor='Name' className='form-label'>Transmission type</label>
                            <input
                                type='text'
                                className='form-control'
                                placeholder='Enter transmission type'
                                name='name'
                                value={transmissionType.name}
                                onChange={onInputChange}
                            />
                        </div>
                        <button type='submit' className="btn btn-outline-primary">Submit</button>
                        <Link className="btn btn-outline-danger mx-2" to={`/admin/transmissionTypes`}>Cancel</Link>
                    </form>
                </div>
            </div>
        </div>
    )
}
