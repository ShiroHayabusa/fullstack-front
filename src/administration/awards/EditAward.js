import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function EditAward() {

    const { id } = useParams();
    let navigate = useNavigate();

    const [award, setAward] = useState({
        name: "",
        description: ""
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        const fetchAward = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/awards/${id}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                setAward({
                    name: response.data.name,
                    description: response.data.description,
                    logo: response.data.logo
                });
            } catch (error) {
                setError('Error fetching award details: ' + error.message);
            }
        };

        fetchAward();
    }, [id]);

    const onInputChange = (e) => {
        setAward({ ...award, [e.target.name]: e.target.value });
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!award.name) {
            setError('Please provide a award name.');
            return;
        }

        const formData = new FormData();
        formData.append('name', award.name);
        formData.append('description', award.description);
        if (selectedFile) {
            formData.append('logo', selectedFile);
        }

        try {
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/admin/awards/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            if (response.status === 200) {
                setSuccess('Award updated successfully');
                setError('');
                navigate('/admin/awards');
            }
        } catch (error) {
            setError('Error updating award: ' + error.message);
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
                    <h2 className='text-center m-4'>Edit award</h2>
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}
                    <form onSubmit={onSubmit}>
                        <div className='mb-3'>
                            <label htmlFor='Name' className='form-label'>Award</label>
                            <input
                                type='text'
                                className='form-control'
                                placeholder='Enter award name'
                                name='name'
                                value={award.name}
                                onChange={onInputChange}
                            />
                        </div>
                        <div className='mb-3'>
                            <textarea
                                type={'text'}
                                className='form-control'
                                placeholder='Enter description'
                                style={{ height: '310px' }}
                                name='description'
                                value={award.description}
                                onChange={(e) => onInputChange(e)}
                            />
                        </div>
                        <div className='mb-3'>
                            <input
                                type='file'
                                className='form-control'
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
