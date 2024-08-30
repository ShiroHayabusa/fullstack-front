import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';

export default function AddModel() {

    let navigate = useNavigate();

    const [model, setModel] = useState({
        name: "",
        years: "",
        description: ""
    });

    const { name, years, description } = model;
    const { make } = useParams();

    const onInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setModel({
            ...model,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('years', years);
        formData.append('description', description);

        try {
            const response = await axios.post(`http://localhost:8080/catalog/${make}/addModel`, formData);
            if (response.status === 200 || response.status === 201) {
                console.log('Model added successfully');
                navigate(`/catalog/${make}`);
            }
        } catch (error) {
            console.error('Error adding model: ', error);
        }
    };

    return (
        <div className='container'>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><a href="/">Home</a></li>
                    <li className="breadcrumb-item"><a href="/catalog">Catalog</a></li>
                    <li className="breadcrumb-item"><a href={`/catalog/${make}`}>{make}</a></li>
                    <li className="breadcrumb-item active" aria-current="page">Add model</li>
                </ol>
            </nav>
            <div className='row'>
                <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow'>
                    <h2 className='text-center m-4'>Add model</h2>
                    <form onSubmit={(e) => onSubmit(e)}>
                        <div className='mb-3'>
                            <label htmlFor='name' className='form-label'>Name</label>
                            <input
                                type={'text'}
                                className='form-control'
                                placeholder='Enter model name'
                                name='name'
                                value={name}
                                onChange={(e) => onInputChange(e)}
                            />
                        </div>
                        <div className='mb-3'>
                            <label className='form-label'>Years</label>
                            <input
                                type={'text'}
                                className='form-control'
                                placeholder='Enter years'
                                name='years'
                                value={years}
                                onChange={(e) => onInputChange(e)}
                            />
                        </div>
                        <div className='mb-3'>
                            <label className='form-label'>Description</label>
                            <input
                                type={'text'}
                                className='form-control'
                                placeholder='Enter description'
                                name='description'
                                value={description}
                                onChange={(e) => onInputChange(e)}
                            />
                        </div>
                        <button type='submit' className="btn btn-outline-primary">Submit</button>
                        <Link className="btn btn-outline-danger mx-2" to={`/catalog/${make}`}>Cancel</Link>
                    </form>
                </div>
            </div>
        </div>
    )
}
