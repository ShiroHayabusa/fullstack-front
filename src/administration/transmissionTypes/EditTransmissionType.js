import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

export default function EditTransmissionType() {

    const { id } = useParams(); // Assuming the transmission type ID is passed as a route parameter
    let navigate = useNavigate();

    const [transmissionType, setTransmissionType] = useState({
        name: ""
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        // Fetch the current details of the transmissionType
        const fetchTransmissionType = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/administration/transmissionTypes/${id}`);
                setTransmissionType({
                    name: response.data.name
                });
                console.log("transmissionType:", response.data)
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
            const response = await axios.put(`http://localhost:8080/administration/transmissionTypes/${id}`, formData);
            if (response.status === 200) {
                setSuccess('Transmission type updated successfully');
                setError('');
                navigate('/administration/transmissionTypes');
            }
        } catch (error) {
            setError('Error updating transmissionType: ' + error.message);
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
                        <Link className="btn btn-outline-danger mx-2" to={`/administration/transmissionTypes`}>Cancel</Link>
                    </form>
                </div>
            </div>
        </div>
    )
}
