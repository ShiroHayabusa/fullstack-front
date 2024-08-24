import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

export default function EditEngine() {

    const { id } = useParams(); // Assuming the engine ID is passed as a route parameter
    let navigate = useNavigate();

    const [engine, setEngine] = useState({
        name: ""
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        // Fetch the current details of the engine
        const fetchEngine = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/administration/engines/${id}`);
                setEngine({
                    name: response.data.name,
                    photo: response.data.photo
                });
                console.log("engine:", response)
            } catch (error) {
                setError('Error fetching engine details: ' + error.message);
            }
        };

        fetchEngine();
    }, [id]);

    const onInputChange = (e) => {
        setEngine({ ...engine, [e.target.name]: e.target.value });
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!engine.name) {
            setError('Please provide a engine name.');
            return;
        }

        const formData = new FormData();
        formData.append('name', engine.name);
        if (selectedFile) {
            formData.append('photo', selectedFile);
        }

        try {
            const response = await axios.put(`http://localhost:8080/administration/engines/${id}`, formData);
            if (response.status === 200) {
                setSuccess('Engine updated successfully');
                setError('');
                navigate('/administration/engines');
            }
        } catch (error) {
            setError('Error updating engine: ' + error.message);
        }
    };

    return (
        <div className='container'>
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><a href="/">Home</a></li>
                    <li class="breadcrumb-item"><a href='/administration'>Administration</a></li>
                    <li class="breadcrumb-item"><a href='/administration/engines'>Engines</a></li>
                    <li class="breadcrumb-item active" aria-current="page">Add engine</li>
                </ol>
            </nav>
            <div className='row'>
                <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow'>
                    <h2 className='text-center m-4'>Edit Engine</h2>
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}
                    <form onSubmit={onSubmit}>
                        <div className='mb-3'>
                            <label htmlFor='Name' className='form-label'>Engine</label>
                            <input
                                type='text'
                                className='form-control'
                                placeholder='Enter engine name'
                                name='name'
                                value={engine.name}
                                onChange={onInputChange}
                            />
                        </div>
                        <img
                            style={{ width: '40px', height: 'auto' }}
                            src={`https://newloripinbucket.s3.amazonaws.com/image/${engine.name || 'defaultMake'}/${engine?.photo?.name || 'defaultImage.jpg'}`}
                            className="mb-3"
                            alt="...">
                        </img>
                        <div className='mb-3'>
                            <input
                                type='file'
                                className='form-control'
                                name='photo'
                                onChange={handleFileChange}
                            />
                        </div>
                        <button type='submit' className="btn btn-outline-primary">Submit</button>
                        <Link className="btn btn-outline-danger mx-2" to={`/administration/engines`}>Cancel</Link>
                    </form>
                </div>
            </div>
        </div>
    )
}