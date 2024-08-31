import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';

export default function AddBody() {

    let navigate = useNavigate();

    const [body, setBody] = useState({
        name: "",
        description: "",
        make: ""
    });

    const { make } = useParams();
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const { name, description } = body;

    const onInputChange = (e) => {
        setBody({ ...body, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!name) {
            setError('Please provide a body name');
            return;
        }

        const formData = new FormData();
        Object.keys(body).forEach(key => {
            formData.append(key, body[key]);
        });

        if (body.make) {
            formData.append('makeId', body.make);
        }

        try {
            const response = await axios.post(`http://localhost:8080/administration/bodies/${make}/addBody`, formData);
            if (response.status === 200 || response.status === 201) {
                setSuccess('Body added successfully');
                setError('');
                setBody({ name: "" });
                navigate(`/administration/bodies/${make}`);
            }
        } catch (error) {
            console.error('Error adding body: ', error.message);
        }
    };

    return (
        <div className='container'>
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><a href="/" className="text-decoration-none">Home</a></li>
                    <li class="breadcrumb-item"><a href='/administration' className="text-decoration-none">Administration</a></li>
                    <li class="breadcrumb-item"><a href='/administration/bodies' className="text-decoration-none">Bodies</a></li>
                    <li class="breadcrumb-item"><a href={`/administration/bodies/${make}`} className="text-decoration-none">{make}</a></li>
                    <li class="breadcrumb-item active" aria-current="page">Add body</li>
                </ol>
            </nav>
            <div className='row'>
                <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow'>
                    <h2 className='text-center m-4'>Add body</h2>
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}
                    <form onSubmit={(e) => onSubmit(e)}>

                        <input
                            type={'text'}
                            className='form-control mt-3 mb-3'
                            placeholder='Enter body name'
                            name='name'
                            value={name}
                            onChange={(e) => onInputChange(e)}
                        />

                        <textarea
                            type={'text'}
                            className='form-control mt-3 mb-3'
                            placeholder='Enter description'
                            name='description'
                            value={description}
                            onChange={(e) => onInputChange(e)}
                        />

                        <button type='submit' className="btn btn-outline-primary">Submit</button>
                        <Link className="btn btn-outline-danger mx-2" to={`/administration/bodies/${make}`}>Cancel</Link>
                    </form>
                </div>
            </div>
        </div>
    )
}
