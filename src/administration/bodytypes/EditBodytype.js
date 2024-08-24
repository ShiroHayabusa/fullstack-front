import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

export default function EditBodytype() {

    const { id } = useParams(); // Assuming the bodytype ID is passed as a route parameter
    let navigate = useNavigate();

    const [bodytype, setBodytype] = useState({
        name: ""
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        // Fetch the current details of the bodytype
        const fetchBodytype = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/administration/bodytypes/${id}`);
                setBodytype({
                    name: response.data.name
                });
                console.log("bodytype:", response.data)
            } catch (error) {
                setError('Error fetching bodytype details: ' + error.message);
            }
        };

        fetchBodytype();
    }, [id]);

    const onInputChange = (e) => {
        setBodytype({ ...bodytype, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!bodytype.name) {
            setError('Please provide a bodytype name.');
            return;
        }

        const formData = new FormData();
        formData.append('name', bodytype.name);

        try {
            const response = await axios.put(`http://localhost:8080/administration/bodytypes/${id}`, formData);
            if (response.status === 200) {
                setSuccess('Bodytype updated successfully');
                setError('');
                navigate('/administration/bodytypes');
            }
        } catch (error) {
            setError('Error updating bodytype: ' + error.message);
        }
    };

    return (
        <div className='container'>
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><a href="/">Home</a></li>
                    <li class="breadcrumb-item"><a href='/administration'>Administration</a></li>
                    <li class="breadcrumb-item"><a href='/administration/bodytypes'>Bodytypes</a></li>
                    <li class="breadcrumb-item active" aria-current="page">Add bodytype</li>
                </ol>
            </nav>
            <div className='row'>
                <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow'>
                    <h2 className='text-center m-4'>Edit bodytype</h2>
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}
                    <form onSubmit={onSubmit}>
                        <div className='mb-3'>
                            <label htmlFor='Name' className='form-label'>Bodytype</label>
                            <input
                                type='text'
                                className='form-control'
                                placeholder='Enter bodytype name'
                                name='name'
                                value={bodytype.name}
                                onChange={onInputChange}
                            />
                        </div>
                        <button type='submit' className="btn btn-outline-primary">Submit</button>
                        <Link className="btn btn-outline-danger mx-2" to={`/administration/bodytypes`}>Cancel</Link>
                    </form>
                </div>
            </div>
        </div>
    )
}
