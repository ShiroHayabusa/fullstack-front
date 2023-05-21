import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';

export default function AddFacelift() {

    let navigate = useNavigate();

    const [facelift, setFacelift] = useState({
        name: ""
    });

    const { name } = facelift;
    const { make, model, generation } = useParams();

    const onInputChange = (e) => {
        setFacelift({ ...facelift, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        await axios.post("http://localhost:8080/catalog/" + make + "/" + model + "/" + generation + "/addFacelift", facelift);
        navigate('/catalog/' + make + "/" + model + "/" + generation);
    };

    return (
        <div className='container'>
            <div className='row'>
                <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow'>
                    <h2 className='text-center m-4'>Add facelift</h2>
                    <form onSubmit={(e) => onSubmit(e)}>
                        <div className='mb-3'>
                            <label htmlFor='Name' className='form-label'>Name</label>
                            <input
                                type={'text'}
                                className='form-control'
                                placeholder='Enter facelift'
                                name='name'
                                value={name}
                                onChange={(e) => onInputChange(e)}
                            />
                        </div>
                        <button type='submit' className="btn btn-outline-primary">Submit</button>
                        <Link className="btn btn-outline-danger mx-2" to={`/catalog/${make}/${model}/${generation}`}>Cancel</Link>
                    </form>
                </div>
            </div>
        </div>
    )
}
