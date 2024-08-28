import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

export default function EditEngineType() {

    const { id } = useParams(); // Assuming the engine type ID is passed as a route parameter
    let navigate = useNavigate();

    const [engineType, setEngineType] = useState({
        name: ""
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        // Fetch the current details of the engineType
        const fetchEngineType = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/administration/engineTypes/${id}`);
                setEngineType({
                    name: response.data.name
                });
                console.log("engineType:", response.data)
            } catch (error) {
                setError('Error fetching engineType details: ' + error.message);
            }
        };

        fetchEngineType();
    }, [id]);

    const onInputChange = (e) => {
        setEngineType({ ...engineType, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!engineType.name) {
            setError('Please provide a engineType name.');
            return;
        }

        const formData = new FormData();
        formData.append('name', engineType.name);

        try {
            const response = await axios.put(`http://localhost:8080/administration/engineTypes/${id}`, formData);
            if (response.status === 200) {
                setSuccess('Engine type updated successfully');
                setError('');
                navigate('/administration/engineTypes');
            }
        } catch (error) {
            setError('Error updating engineType: ' + error.message);
        }
    };

    return (
        <div className='container'>
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><a href="/">Home</a></li>
                    <li class="breadcrumb-item"><a href='/administration'>Administration</a></li>
                    <li class="breadcrumb-item"><a href='/administration/engineTypes'>Engine types</a></li>
                    <li class="breadcrumb-item active" aria-current="page">Add engine type</li>
                </ol>
            </nav>
            <div className='row'>
                <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow'>
                    <h2 className='text-center m-4'>Edit engine type</h2>
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}
                    <form onSubmit={onSubmit}>
                        <div className='mb-3'>
                            <label htmlFor='Name' className='form-label'>Engine type</label>
                            <input
                                type='text'
                                className='form-control'
                                placeholder='Enter engine type'
                                name='name'
                                value={engineType.name}
                                onChange={onInputChange}
                            />
                        </div>
                        <button type='submit' className="btn btn-outline-primary">Submit</button>
                        <Link className="btn btn-outline-danger mx-2" to={`/administration/engineTypes`}>Cancel</Link>
                    </form>
                </div>
            </div>
        </div>
    )
}
