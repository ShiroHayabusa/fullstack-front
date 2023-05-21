import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';

export default function AddGeneration() {

    let navigate = useNavigate();

    const [generation, setGeneration] = useState({
        name: ""
    });

    const { name } = generation;
    const { make, model } = useParams();

    const onInputChange = (e) => {
        setGeneration({ ...generation, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        await axios.post("http://localhost:8080/catalog/" + make + "/" + model + "/addGeneration", generation);
        navigate('/catalog/' + make + "/" + model);
    };

    return (
        <div className='container'>
            <div className='row'>
                <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow'>
                    <h2 className='text-center m-4'>Add generation</h2>
                    <form onSubmit={(e) => onSubmit(e)}>
                        <div className='mb-3'>
                            <label htmlFor='Name' className='form-label'>Name</label>
                            <input
                                type={'text'}
                                className='form-control'
                                placeholder='Enter generation'
                                name='name'
                                value={name}
                                onChange={(e) => onInputChange(e)}
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
