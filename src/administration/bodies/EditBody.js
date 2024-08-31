import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

export default function EditBody() {

    const { make, bodyId } = useParams();
    let navigate = useNavigate();

    const [body, setBody] = useState({
        name: "",
        description: ""
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        // Fetch the current details of the body
        const fetchBody = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/administration/bodies/${make}/${bodyId}`);
                setBody({
                    name: response.data.name,
                    description: response.data.description
                });
                console.log("body:", response.data)
            } catch (error) {
                setError('Error fetching body details: ' + error.message);
            }
        };

        fetchBody();
    }, []);

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
        Object.keys(body).forEach(key => {
            formData.append(key, body[key]);
        });

        try {
            const response = await axios.put(`http://localhost:8080/administration/bodies/${make}/${bodyId}`, formData);
            if (response.status === 200) {
                setSuccess('Body updated successfully');
                setError('');
                navigate(`/administration/bodies/${make}/${bodyId}`);
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

                        <input
                            type='text'
                            className='form-control mt-3 mb-3'
                            placeholder='Enter body name'
                            name='name'
                            value={body.name}
                            onChange={onInputChange}
                        />

                        <textarea
                            type='text'
                            className='form-control mt-3 mb-3'
                            placeholder='Enter description'
                            name='description'
                            value={body.description}
                            onChange={onInputChange}
                        />

                        <button type='submit' className="btn btn-outline-primary">Submit</button>
                        <Link className="btn btn-outline-danger mx-2" to={`/administration/bodies/${make}/${bodyId}`}>Cancel</Link>
                    </form>
                </div>
            </div>
        </div>
    )
}
