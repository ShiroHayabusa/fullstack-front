import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';

export default function EditMake() {

    let navigate = useNavigate();

    const { id } = useParams();

    const [make, setMake] = useState({
        name: ""
    });

    const { name } = make;

    const onInputChange = (e) => {
        setMake({ ...make, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        loadMake();
    }, []);

    const onSubmit = async (e) => {
        e.preventDefault();
        await axios.put(`http://localhost:8080/make/${id}`, make);
        navigate('/makes');
    };

    const loadMake = async () => {
        const result = await axios.get(`http://localhost:8080/make/${id}`);
        setMake(result.data);
    }

    return (
        <div className='container'>
            <div className='row'>
                <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow'>
                    <h2 className='text-center m-4'>Edit Make</h2>
                    <form onSubmit={(e) => onSubmit(e)}>
                        <div className='mb-3'>
                            <label htmlFor='Name' className='form-label'>Name</label>
                            <input
                                type={'text'}
                                className='form-control'
                                placeholder='Enter make name'
                                name='name'
                                value={name}
                                onChange={(e) => onInputChange(e)}
                            />
                        </div>
                       
                        <button type='submit' className="btn btn-outline-primary">Submit</button>
                        <Link className="btn btn-outline-danger mx-2" to='/makes'>Cancel</Link>
                    </form>
                </div>
            </div>
        </div>
    )
}