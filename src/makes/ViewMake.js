import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

export default function ViewUser() {

    const [make, setMake] = useState({
        name: ''
    });

    const { id } = useParams();

    useEffect(() => {
        loadMake()
    }, []);

    const loadMake = async () => {
        const result = await axios.get(`http://localhost:8080/make/${id}`);
        setMake(result.data);
    }

    return (
        <div className='container'>
            <div className='row'>
                <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow'>
                    <h2 className='text-center m-4'>Make Details</h2>
                    <div className='card'>
                        <div className='card-header'>
                            Details of make id : {make.id}
                            <ul className='list-group list-group-flush'>
                                <li className='list-group-item'>
                                    <b>Name:</b>
                                    {make.name}
                                </li>
                            </ul>
                        </div>
                    </div>
                    <Link className='btn btn-primary my-2' to={'/makes'}>Back to Makes</Link>
                </div>
            </div>
        </div>
    )
}
