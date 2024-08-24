import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

export default function AddDrivetrain() {

    let navigate = useNavigate();

    const [drivetrain, setDrivetrain] = useState({
        name: ""
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const { name } = drivetrain;

    const onInputChange = (e) => {
        setDrivetrain({ ...drivetrain, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!name) {
            setError('Please provide a drivetrain name');
            return;
        }
        const formData = new FormData();
        formData.append('name', drivetrain.name);
        try {
            const response = await axios.post('http://localhost:8080/administration/drivetrains/addDrivetrain', formData);
            if (response.status === 200 || response.status === 201) {
                setSuccess('Drivetrain added successfully');
                setError('');
                setDrivetrain({ name: "" });
                navigate('/administration/drivetrains');
            }
        } catch (error) {
            console.error('Error adding drivetrain: ', error.message);
        }
    };

    return (
        <div className='container'>
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><a href="/">Home</a></li>
                    <li class="breadcrumb-item"><a href='/administration'>Administration</a></li>
                    <li class="breadcrumb-item"><a href='/administration/drivetrains'>Drivetrains</a></li>
                    <li class="breadcrumb-item active" aria-current="page">Add drivetrain</li>
                </ol>
            </nav>
            <div className='row'>
                <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow'>
                    <h2 className='text-center m-4'>Add drivetrain</h2>
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}
                    <form onSubmit={(e) => onSubmit(e)}>
                        <div className='mb-3'>
                            <label htmlFor='Name' className='form-label'>Drivetrain</label>
                            <input
                                type={'text'}
                                className='form-control'
                                placeholder='Enter drivetrain name'
                                name='name'
                                value={name}
                                onChange={(e) => onInputChange(e)}
                            />
                        </div>
                        <button type='submit' className="btn btn-outline-primary">Submit</button>
                        <Link className="btn btn-outline-danger mx-2" to={`/administration/drivetrains`}>Cancel</Link>
                    </form>
                </div>
            </div>
        </div>
    )
}