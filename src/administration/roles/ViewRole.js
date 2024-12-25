import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

export default function ViewRole() {

    const [role, setRole] = useState({
        name: ''
    });

    const { id } = useParams();

    useEffect(() => {
        loadRole()
    }, []);

    const loadRole = async () => {
        const result = await axios.get(`http://localhost:8080/administration/roles/${id}`);
        setRole(result.data);
    }

    return (
        <div className='container'>
            <div className='row'>
                <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow'>
                    <h2 className='text-center m-4'>Role Details</h2>
                    <div className='card'>
                        <div className='card-header'>
                            Details of role id : {role.id}
                            <ul className='list-group list-group-flush'>
                                <li className='list-group-item'>
                                    <b>Name:</b>
                                    {role.name}
                                </li>
                            </ul>
                        </div>
                    </div>
                    <Link className='btn btn-primary my-2' to={'/administration/roles'}>Back to Roles</Link>
                </div>
            </div>
        </div>
    )
}
