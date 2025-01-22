import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function EditBody() {

    const { make, bodyId } = useParams();
    let navigate = useNavigate();

    const [body, setBody] = useState({
        name: "",
        description: ""
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        const fetchBody = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/bodies/${make}/${bodyId}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                setBody({
                    name: response.data.name,
                    description: response.data.description
                });
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
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/admin/bodies/${make}/${bodyId}`, formData, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            if (response.status === 200) {
                setSuccess('Body updated successfully');
                setError('');
                navigate(`/admin/bodies/${make}/${bodyId}`);
            }
        } catch (error) {
            setError('Error updating body: ' + error.message);
        }
    };

    return (
        <div className='container'>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb mt-3">
                    <li className="breadcrumb-item"><a href="/" className='text-decoration-none'>Home</a></li>
                    <li className="breadcrumb-item"><a href='/admin' className='text-decoration-none'>Administration</a></li>
                    <li className="breadcrumb-item"><a href='/admin/bodies' className='text-decoration-none'>Bodies</a></li>
                    <li className="breadcrumb-item active" aria-current="page">Add body</li>
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
                            style={{ height: '310px' }}
                            name='description'
                            value={body.description}
                            onChange={onInputChange}
                        />

                        <button type='submit' className="btn btn-outline-primary">Submit</button>
                        <Link className="btn btn-outline-danger mx-2" to={`/admin/bodies/${make}/${bodyId}`}>Cancel</Link>
                    </form>
                </div>
            </div>
        </div>
    )
}
