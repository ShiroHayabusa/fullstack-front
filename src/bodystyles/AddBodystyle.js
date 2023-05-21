import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';

export default function AddBodystyle() {

    let navigate = useNavigate();

    const [bodystyle, setBodystyle] = useState({
        name: ""
    });

    const { name } = bodystyle;
    const { make, model, generation } = useParams();


    const onInputChange = (e) => {
        setBodystyle({ ...bodystyle, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        await axios.post("http://localhost:8080/catalog/" + make + "/" + model + "/" + generation + "/addBodystyle", bodystyle);
        navigate('/catalog/' + make + "/" + model + "/" + generation);
    };

    return (
        <div className='container'>
            <div className='row'>
                <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow'>
                    <h2 className='text-center m-4'>Add bodystyle</h2>
                    <form onSubmit={(e) => onSubmit(e)}>
                        <div className='mb-3'>
                            <label htmlFor='Name' className='form-label'>Name</label>
                            <input
                                type={'text'}
                                className='form-control'
                                placeholder='Enter bodystyle'
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
