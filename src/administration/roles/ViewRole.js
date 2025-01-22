import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext';

export default function ViewRole() {

    const [role, setRole] = useState({
        name: ''
    });

    const { id } = useParams();
    const { user } = useAuth();

    useEffect(() => {
        loadRole()
    }, []);

    const loadRole = async () => {
        const result = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/roles/${id}`, {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        });
        setRole(result.data);
    }

    return (
        <div className='container'>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb mt-3">
                    <li className="breadcrumb-item"><a href="/" className="text-decoration-none">Home</a></li>
                    <li className="breadcrumb-item"><a href='/admin' className="text-decoration-none">Administration</a></li>
                    <li className="breadcrumb-item"><a href='/admin/roles' className="text-decoration-none">Roles</a></li>
                    <li className="breadcrumb-item active" aria-current="page">{role.name}</li>
                </ol>
            </nav>
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
                    <Link className='btn btn-primary mt-3' to={'/admin/roles'}>Back to Roles</Link>
                </div>
            </div>
        </div>
    )
}
