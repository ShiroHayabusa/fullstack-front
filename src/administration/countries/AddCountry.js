import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AddCountry() {

    let navigate = useNavigate();

    const [country, setCountry] = useState({
        name: ""
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const { name } = country;
    const { user } = useAuth(); 

    const onInputChange = (e) => {
        setCountry({ ...country, [e.target.name]: e.target.value });
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!name || !selectedFile) {
            setError('Please provide a country name and upload a flag image.');
            return;
        }
        const formData = new FormData();
        formData.append('name', country.name);
        formData.append('flag', selectedFile);
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/countries/addCountry`, formData, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            if (response.status === 200 || response.status === 201) {
                setSuccess('Country added successfully');
                setError('');
                setCountry({ name: "" });
                setSelectedFile(null);
                navigate('/admin/countries');
            }
        } catch (error) {
            console.error('Error adding country: ', error.message);
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
                    <h2 className='text-center m-4'>Add country</h2>
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}
                    <form onSubmit={(e) => onSubmit(e)}>
                        <div className='mb-3'>
                            <label htmlFor='Name' className='form-label'>Country</label>
                            <input
                                type={'text'}
                                className='form-control'
                                placeholder='Enter country'
                                name='name'
                                value={name}
                                onChange={(e) => onInputChange(e)}
                            />
                        </div>
                        <div className='mb-3'>
                            <input
                                type="file"
                                className="form-control"
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
