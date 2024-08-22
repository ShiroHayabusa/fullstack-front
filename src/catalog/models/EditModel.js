import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

export default function EditModel() {

    const { make, model } = useParams();
    let navigate = useNavigate();

    const [modelEntity, setModelEntity] = useState({
        name: "",
        description: "",
        years: ""
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        // Fetch the current details of the model
        const fetchModelEntity = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/catalog/${make}/${model}/editModel`);
                setModelEntity({
                    name: response.data.name,
                    description: response.data.description,
                    years: response.data.years
                });
                console.log("model:", response.data)
            } catch (error) {
                setError('Error fetching make details: ' + error.message);
            }
        };

        fetchModelEntity();
    }, [model]);

    const onInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setModelEntity({
            ...modelEntity,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        if (!model) {
            setError('Please provide a model name.');
            return;
        }

        const formData = new FormData();
        formData.append('name', modelEntity.name);
        formData.append('description', modelEntity.description);
        formData.append('years', modelEntity.years);

        try {
            const response = await axios.put(`http://localhost:8080/catalog/${make}/${model}/editModel`, formData);

            if (response.status === 200) {
                setSuccess('Make updated successfully');
                setError('');
                navigate(`/catalog/${make}/${modelEntity.name}`);
            }
        } catch (error) {
            setError('Error updating make: ' + (error.response?.data?.message || error.message));
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
                    <li class="breadcrumb-item active" aria-current="page">Edit model</li>
                </ol>
            </nav>
            <div className='row'>
                <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow'>
                    <h2 className='text-center m-4'>Edit Model</h2>
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}
                    <form onSubmit={onSubmit}>
                        <div className='mb-3'>
                            <label htmlFor='Name' className='form-label'>Model</label>
                            <input
                                type='text'
                                className='form-control'
                                placeholder='Enter model name'
                                name='name'
                                value={modelEntity.name}
                                onChange={onInputChange}
                            />
                        </div>
                        <div className='mb-3'>
                            <textarea
                                type='text'
                                className='form-control'
                                placeholder='Enter description'
                                name='description'
                                value={modelEntity.description}
                                onChange={onInputChange}
                            />
                        </div>

                        <div className='mb-3'>
                            <label htmlFor='years' className='form-label'>Years</label>
                            <input
                                type='text'
                                className='form-control'
                                placeholder='Enter model years'
                                name='years'
                                value={modelEntity.years}
                                onChange={onInputChange}
                            />
                        </div>

                        <button type='submit' className="btn btn-outline-primary">Submit</button>
                        <Link className="btn btn-outline-danger mx-2" to={`/catalog/${make}/${model}`}>Cancel</Link>
                    </form>
                </div>
            </div>
        </div>
    )
}
