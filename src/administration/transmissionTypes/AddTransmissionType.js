import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

export default function AddTransmissionType() {

    let navigate = useNavigate();

    const [transmissionType, setTransmissionType] = useState({
        name: ""
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const { name } = transmissionType;

    const onInputChange = (e) => {
        setTransmissionType({ ...transmissionType, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!name) {
            setError('Please provide a transmission type');
            return;
        }
        const formData = new FormData();
        formData.append('name', transmissionType.name);
        try {
            const response = await axios.post('http://localhost:8080/administration/transmissionTypes/addTransmissionType', formData);
            if (response.status === 200 || response.status === 201) {
                setSuccess('Transmission type added successfully');
                setError('');
                setTransmissionType({ name: "" });
                navigate('/administration/transmissionTypes');
            }
        } catch (error) {
            console.error('Error adding transmission type: ', error.message);
        }
    };

    return (
        <div className='container'>
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><a href="/">Home</a></li>
                    <li class="breadcrumb-item"><a href='/administration'>Administration</a></li>
                    <li class="breadcrumb-item"><a href='/administration/transmissionTypes'>Transmission types</a></li>
                    <li class="breadcrumb-item active" aria-current="page">Add transmission type</li>
                </ol>
            </nav>
            <div className='row'>
                <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow'>
                    <h2 className='text-center m-4'>Add transmission type</h2>
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}
                    <form onSubmit={(e) => onSubmit(e)}>
                        <div className='mb-3'>
                            <label htmlFor='Name' className='form-label'>Transmission type</label>
                            <input
                                type={'text'}
                                className='form-control'
                                placeholder='Enter transmission type'
                                name='name'
                                value={name}
                                onChange={(e) => onInputChange(e)}
                            />
                        </div>
                        <button type='submit' className="btn btn-outline-primary">Submit</button>
                        <Link className="btn btn-outline-danger mx-2" to={`/administration/transmissionTypes`}>Cancel</Link>
                    </form>
                </div>
            </div>
        </div>
    )
}
