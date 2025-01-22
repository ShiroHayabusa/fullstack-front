import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function EditCountry() {

    const { id } = useParams();
    let navigate = useNavigate();

    const [country, setCountry] = useState({
        name: ""
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        const fetchCountry = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/countries/${id}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                setCountry({
                    name: response.data.name,
                    flag: response.data.flag
                });
            } catch (error) {
                setError('Error fetching country details: ' + error.message);
            }
        };

        fetchCountry();
    }, [id]);

    const onInputChange = (e) => {
        setCountry({ ...country, [e.target.name]: e.target.value });
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!country.name) {
            setError('Please provide a country name.');
            return;
        }

        const formData = new FormData();
        formData.append('name', country.name);
        if (selectedFile) {
            formData.append('flag', selectedFile);
        }

        try {
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/admin/countries/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            if (response.status === 200) {
                setSuccess('Country updated successfully');
                setError('');
                navigate('/admin/countries');
            }
        } catch (error) {
            setError('Error updating country: ' + error.message);
        }
    };

    return (
        <div className='container'>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><a href="/">Home</a></li>
                    <li className="breadcrumb-item"><a href='/admin'>Administration</a></li>
                    <li className="breadcrumb-item"><a href='/admin/countries'>Countries</a></li>
                    <li className="breadcrumb-item active" aria-current="page">Add country</li>
                </ol>
            </nav>
            <div className='row'>
                <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow'>
                    <h2 className='text-center m-4'>Edit Country</h2>
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}
                    <form onSubmit={onSubmit}>
                        <div className='mb-3'>
                            <label htmlFor='Name' className='form-label'>Country</label>
                            <input
                                type='text'
                                className='form-control'
                                placeholder='Enter country'
                                name='name'
                                value={country.name}
                                onChange={onInputChange}
                            />
                        </div>
                        <img
                            style={{ width: '40px', height: 'auto' }}
                            src={`https://newloripinbucket.s3.amazonaws.com/image/countries/${country.name || 'defaultMake'}/${country?.flag?.name || 'defaultImage.jpg'}`}
                            className="mb-3"
                            alt="...">
                        </img>
                        <div className='mb-3'>
                            <input
                                type='file'
                                className='form-control'
                                name='flag'
                                onChange={handleFileChange}
                            />
                        </div>
                        <button type='submit' className="btn btn-outline-primary">Submit</button>
                        <Link className="btn btn-outline-danger mx-2" to={`/admin/countries`}>Cancel</Link>
                    </form>
                </div>
            </div>
        </div>
    )
}
