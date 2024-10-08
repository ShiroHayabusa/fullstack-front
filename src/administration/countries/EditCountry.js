import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

export default function EditCountry() {

    const { id } = useParams(); // Assuming the country ID is passed as a route parameter
    let navigate = useNavigate();

    const [country, setCountry] = useState({
        name: ""
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        // Fetch the current details of the country
        const fetchCountry = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/administration/countries/${id}`);
                setCountry({
                    name: response.data.name,
                    flag: response.data.flag
                });
                console.log("country:", response)
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
            const response = await axios.put(`http://localhost:8080/administration/countries/${id}`, formData);
            if (response.status === 200) {
                setSuccess('Country updated successfully');
                setError('');
                navigate('/administration/countries');
            }
        } catch (error) {
            setError('Error updating country: ' + error.message);
        }
    };

    return (
        <div className='container'>
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><a href="/">Home</a></li>
                    <li class="breadcrumb-item"><a href='/administration'>Administration</a></li>
                    <li class="breadcrumb-item"><a href='/administration/countries'>Countries</a></li>
                    <li class="breadcrumb-item active" aria-current="page">Add country</li>
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
                        <Link className="btn btn-outline-danger mx-2" to={`/administration/countries`}>Cancel</Link>
                    </form>
                </div>
            </div>
        </div>
    )
}
