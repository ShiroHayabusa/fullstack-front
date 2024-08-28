import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

export default function AddBodytype() {

    let navigate = useNavigate();

    const [bodytype, setBodytype] = useState({
        name: ""
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const { name } = bodytype;

    const onInputChange = (e) => {
        setBodytype({ ...bodytype, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!name) {
            setError('Please provide a bodytype name');
            return;
        }
        const formData = new FormData();
        formData.append('name', bodytype.name);
        try {
            const response = await axios.post('http://localhost:8080/administration/bodytypes/addBodytype', formData);
            if (response.status === 200 || response.status === 201) {
                setSuccess('Bodytype added successfully');
                setError('');
                setBodytype({ name: "" });
                navigate('/administration/bodytypes');
            }
        } catch (error) {
            console.error('Error adding bodytype: ', error.message);
        }
    };

    return (
        <div className='container'>
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><a href="/">Home</a></li>
                    <li class="breadcrumb-item"><a href='/administration'>Administration</a></li>
                    <li class="breadcrumb-item"><a href='/administration/bodytypes'>Bodytypes</a></li>
                    <li class="breadcrumb-item active" aria-current="page">Add bodytype</li>
                </ol>
            </nav>
            <div className='row'>
                <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow'>
                    <h2 className='text-center m-4'>Add bodytype</h2>
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}
                    <form onSubmit={(e) => onSubmit(e)}>
                        <div className='mb-3'>
                            <label htmlFor='Name' className='form-label'>Bodytype</label>
                            <input
                                type={'text'}
                                className='form-control'
                                placeholder='Enter bodytype name'
                                name='name'
                                value={name}
                                onChange={(e) => onInputChange(e)}
                            />
                        </div>
                        <button type='submit' className="btn btn-outline-primary">Submit</button>
                        <Link className="btn btn-outline-danger mx-2" to={`/administration/bodytypes`}>Cancel</Link>
                    </form>
                </div>
            </div>
        </div>
    )
}