import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

export default function EditFacelift() {

    const { make, model, generationId, faceliftId } = useParams();
    let navigate = useNavigate();

    const [faceliftEntity, setFaceliftEntity] = useState({
        name: "",
        years: "",
        description: ""
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [generationEntity, setGenerationEntity] = useState({
        name: ''
    });

    useEffect(() => {
        // Fetch the current details of the model
        const fetchFaceliftEntity = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/catalog/${make}/${model}/${generationId}/${faceliftId}/editFacelift`);
                setFaceliftEntity({
                    name: response.data.name,
                    years: response.data.years,
                    description: response.data.description
                });
                console.log("facelift:", response.data)
            } catch (error) {
                setError('Error fetching facelift details: ' + error.message);
            }
        };

        fetchFaceliftEntity();
        loadGenerationEntity();
    }, [make, model, generationId, faceliftId]);

    const loadGenerationEntity = async () => {
        const result = await axios.get(`http://localhost:8080/catalog/${make}/${model}/${generationId}`);
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
        formData.append('years', faceliftEntity.years);
        formData.append('description', faceliftEntity.description);

        try {
            const response = await axios.put(`http://localhost:8080/catalog/${make}/${model}/${generationId}/${faceliftId}/editFacelift`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
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
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><a href="/">Home</a></li>
                    <li class="breadcrumb-item"><a href='/catalog'>Catalog</a></li>
                    <li class="breadcrumb-item"><a href={`/catalog/${make}/`}>{make}</a></li>
                    <li class="breadcrumb-item"><a href={`/catalog/${make}/${model}`}>{model}</a></li>
                    <li class="breadcrumb-item"><a href={`/catalog/${make}/${model}/${generationId}`}>{generationEntity.name}</a></li>
                    <li class="breadcrumb-item active" aria-current="page">Edit facelift</li>
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
                            <label htmlFor='years' className='form-label'>Years</label>
                            <input
                                type='text'
                                className='form-control'
                                placeholder='Enter facelift years'
                                name='years'
                                value={faceliftEntity.years}
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