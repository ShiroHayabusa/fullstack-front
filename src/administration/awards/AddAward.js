import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { StepDescription } from 'semantic-ui-react';

export default function AddAward() {

    let navigate = useNavigate();

    const [award, setAward] = useState({
        name: '',
        description: '',
    });

    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const { name, description } = award;
    const { user } = useAuth();

    const onInputChange = (e) => {
        setAward({ ...award, [e.target.name]: e.target.value });
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!name || !selectedFile) {
            setError('Please provide an award name and upload a logo image');
            return;
        }
        const formData = new FormData();
        formData.append('name', award.name);
        formData.append('description', award.description);
        formData.append('logo', selectedFile);
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/awards/addAward`, formData, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            if (response.status === 200 || response.status === 201) {
                setSuccess('Award added successfully');
                setError('');
                setAward({ name: "" });
                StepDescription({ description: "" });
                setSelectedFile(null);
                navigate('/admin/awards');
            }
        } catch (error) {
            console.error('Error adding award: ', error.message);
            setError('Something went wrong');
        }
    };

    return (
        <div className='container'>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb mt-3">
                    <li className="breadcrumb-item"><a href="/" className="text-decoration-none">Home</a></li>
                    <li className="breadcrumb-item"><a href='/admin' className="text-decoration-none">Administration</a></li>
                    <li className="breadcrumb-item"><a href='/admin/awards' className="text-decoration-none">Awards</a></li>
                    <li className="breadcrumb-item active" aria-current="page">Add award</li>
                </ol>
            </nav>
            <div className='row'>
                <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow'>
                    <h2 className='text-center m-4'>Add award</h2>
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}
                    <form onSubmit={(e) => onSubmit(e)}>
                        <div className='mb-3'>
                            <input
                                type={'text'}
                                className='form-control mb-3'
                                placeholder='Enter award name'
                                name='name'
                                value={name}
                                onChange={(e) => onInputChange(e)}
                            />
                        </div>
                        <div className='mb-3'>
                            <textarea
                                type={'text'}
                                className='form-control'
                                placeholder='Enter description'
                                style={{ height: '310px' }}
                                name='description'
                                value={description}
                                onChange={(e) => onInputChange(e)}
                            />
                        </div>
                        <div className='mb-3'>
                            <input
                                type="file"
                                className="form-control"
                                name='logo'
                                onChange={handleFileChange}
                            />
                        </div>
                        <button type='submit' className="btn btn-outline-primary">Submit</button>
                        <Link className="btn btn-outline-danger mx-2" to={`/admin/awards`}>Cancel</Link>
                    </form>
                </div>
            </div>
        </div>
    )
}
