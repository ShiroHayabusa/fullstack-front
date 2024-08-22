import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

export default function EditBody() {

    const { id } = useParams(); // Assuming the body ID is passed as a route parameter
    let navigate = useNavigate();

    const [body, setBody] = useState({
        name: ""
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        // Fetch the current details of the body
        const fetchBody = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/administration/bodies/${id}`);
                setBody({
                    name: response.data.name
                });
                console.log("body:", response.data)
            } catch (error) {
                setError('Error fetching body details: ' + error.message);
            }
        };

        fetchBody();
    }, [id]);

    const onInputChange = (e) => {
        setBody({ ...body, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!body.name) {
            setError('Please provide a body name.');
            return;
        }

        const formData = new FormData();
        formData.append('name', body.name);

        try {
            const response = await axios.put(`http://localhost:8080/administration/bodies/${id}`, formData);
            if (response.status === 200) {
                setSuccess('Body updated successfully');
                setError('');
                navigate('/administration/bodies');
            }
        } catch (error) {
            setError('Error updating body: ' + error.message);
        }
    };

    return (
        <div className='container'>
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><a href="/">Home</a></li>
                    <li class="breadcrumb-item"><a href='/administration'>Administration</a></li>
                    <li class="breadcrumb-item"><a href='/administration/bodies'>Bodies</a></li>
                    <li class="breadcrumb-item active" aria-current="page">Add body</li>
                </ol>
            </nav>
            <div className='row'>
                <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow'>
                    <h2 className='text-center m-4'>Edit body</h2>
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}
                    <form onSubmit={onSubmit}>
                        <div className='mb-3'>
                            <label htmlFor='Name' className='form-label'>Body</label>
                            <input
                                type='text'
                                className='form-control'
                                placeholder='Enter body name'
                                name='name'
                                value={body.name}
                                onChange={onInputChange}
                            />
                        </div>
                        <button type='submit' className="btn btn-outline-primary">Submit</button>
                        <Link className="btn btn-outline-danger mx-2" to={`/administration/bodies`}>Cancel</Link>
                    </form>
                </div>
            </div>
        </div>
    )
}
