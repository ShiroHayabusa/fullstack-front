import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function EditFacelift() {

    const { make, model, generationId, faceliftId } = useParams();
    let navigate = useNavigate();

    const [faceliftEntity, setFaceliftEntity] = useState({
        name: "",
        description: ""
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [generationEntity, setGenerationEntity] = useState({
        name: ''
    });
    const [modelDetails, setModelDetails] = useState(null);

    const { user } = useAuth();

    const loadModelDetails = async () => {
        try {
            const result = await axios.get(`${process.env.REACT_APP_API_URL}/api/catalog/${make}/${model}`);
            setModelDetails(result.data);
        } catch (error) {
            console.error('Error loading model details:', error);
        }
    };

    useEffect(() => {
        const fetchFaceliftEntity = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/catalog/${make}/${model}/${generationId}/${faceliftId}/editFacelift`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                setFaceliftEntity({
                    name: response.data.name,
                    description: response.data.description
                });
            } catch (error) {
                setError('Error fetching facelift details: ' + error.message);
            }
        };

        fetchFaceliftEntity();
        loadGenerationEntity();
        loadModelDetails();
    }, [make, model, generationId, faceliftId]);

    const loadGenerationEntity = async () => {
        const result = await axios.get(`${process.env.REACT_APP_API_URL}/api/catalog/${make}/${model}/${generationId}/editGeneration`, {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        });
        setGenerationEntity(result.data);
    }

    const onInputChange = (e) => {
        const { name, value } = e.target;
        setFaceliftEntity({
            ...faceliftEntity,
            [name]: value
        });
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        if (!faceliftEntity.name) {
            setError('Please provide a facelift name.');
            return;
        }

        const formData = new FormData();
        formData.append('name', faceliftEntity.name);
        formData.append('description', faceliftEntity.description);

        try {
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/catalog/${make}/${model}/${generationId}/${faceliftId}/editFacelift`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${user.token}`
                }
            });

            if (response.status === 200) {
                setSuccess('Facelift updated successfully');
                setError('');
                navigate(`/catalog/${make}/${model}/${generationId}`);
            }
        } catch (error) {
            setError('Error updating facelift: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className='container'>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb mt-2">
                    <li className="breadcrumb-item"><a href="/" className="text-decoration-none">Home</a></li>
                    <li className="breadcrumb-item"><a href='/catalog' className="text-decoration-none">Catalog</a></li>
                    <li className="breadcrumb-item"><a href={`/catalog/${make}/`} className="text-decoration-none">{make}</a></li>
                    <li className="breadcrumb-item"><a href={`/catalog/${make}/${model}`} className="text-decoration-none">{modelDetails?.name}</a></li>
                    <li className="breadcrumb-item"><a href={`/catalog/${make}/${model}/${generationId}`} className="text-decoration-none">{generationEntity.name}</a></li>
                    <li className="breadcrumb-item active" aria-current="page">Edit facelift</li>
                </ol>
            </nav>
            <div className='row'>
                <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow'>
                    <h2 className='text-center m-4'>Edit Facelift</h2>
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}
                    <form onSubmit={onSubmit}>
                        <div className='mb-3'>
                            <label htmlFor='Name' className='form-label'>Facelift</label>
                            <input
                                type='text'
                                className='form-control'
                                placeholder='Enter facelift name'
                                name='name'
                                value={faceliftEntity.name}
                                onChange={onInputChange}
                            />
                        </div>
                        <div className='mb-3'>
                            <textarea
                                type='text'
                                className='form-control'
                                placeholder='Enter description'
                                name='description'
                                value={faceliftEntity.description}
                                onChange={onInputChange}
                            />
                        </div>

                        <button type='submit' className="btn btn-outline-primary">Submit</button>
                        <Link className="btn btn-outline-danger mx-2" to={`/catalog/${make}/${model}/${generationId}`}>Cancel</Link>
                    </form>
                </div>
            </div>
        </div>
    )
}
