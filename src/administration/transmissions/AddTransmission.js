import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

export default function AddTransmission() {

    let navigate = useNavigate();

    const [transmission, setTransmission] = useState({
        name: ""
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const { name } = transmission;

    const onInputChange = (e) => {
        setTransmission({ ...transmission, [e.target.name]: e.target.value });
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!name || !selectedFile) {
            setError('Please provide an transmission name and upload photo.');
            return;
        }
        const formData = new FormData();
        formData.append('name', transmission.name);
        formData.append('photo', selectedFile);
        try {
            const response = await axios.post('http://localhost:8080/administration/transmissions/addTransmission', formData);
            if (response.status === 200 || response.status === 201) {
                setSuccess('Transmission added successfully');
                setError('');
                setTransmission({ name: "" });
                setSelectedFile(null);
                navigate('/administration/transmissions');
            }
        } catch (error) {
            console.error('Error adding transmission: ', error.message);
        }
    };

    return (
        <div className='container'>
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><a href="/">Home</a></li>
                    <li class="breadcrumb-item"><a href='/administration'>Administration</a></li>
                    <li class="breadcrumb-item"><a href='/administration/transmissions'>Transmissions</a></li>
                    <li class="breadcrumb-item active" aria-current="page">Add transmission</li>
                </ol>
            </nav>
            <div className='row'>
                <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow'>
                    <h2 className='text-center m-4'>Add transmission</h2>
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}
                    <form onSubmit={(e) => onSubmit(e)}>
                        <div className='mb-3'>
                            <label htmlFor='Name' className='form-label'>Transmission</label>
                            <input
                                type={'text'}
                                className='form-control'
                                placeholder='Enter transmission name'
                                name='name'
                                value={name}
                                onChange={(e) => onInputChange(e)}
                            />
                        </div>
                        <div className='mb-3'>
                            <input
                                type="file"
                                className="form-control"
                                name='photo'
                                onChange={handleFileChange}
                            />
                        </div>
                        <button type='submit' className="btn btn-outline-primary">Submit</button>
                        <Link className="btn btn-outline-danger mx-2" to={`/administration/transmissions`}>Cancel</Link>
                    </form>
                </div>
            </div>
        </div>
    )
}
