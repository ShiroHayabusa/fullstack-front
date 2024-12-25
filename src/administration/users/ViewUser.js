import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

export default function ViewUser() {
    const [user, setUser] = useState({
        name: '',
        username: '',
        email: '',
        roles: [] // Инициализация ролей как массива строк
    });

    const { id } = useParams();

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            const result = await axios.get(`http://localhost:8080/administration/users/${id}`);
            setUser(result.data);
        } catch (error) {
            console.error('Error loading user:', error);
        }
    };

    return (
        <div className='container'>
            <div className='row'>
                <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow'>
                    <h2 className='text-center m-4'>User Details</h2>
                    <div className='card'>
                        <div className='card-header'>
                            Details of user id : {user.id}
                            <ul className='list-group list-group-flush'>
                                <li className='list-group-item'>
                                    <b>Name:</b> {user.name}
                                </li>
                                <li className='list-group-item'>
                                    <b>Username:</b> {user.username}
                                </li>
                                <li className='list-group-item'>
                                    <b>Email:</b> {user.email}
                                </li>
                                <li className='list-group-item'>
                                    <b>Roles:</b> {user.roles.length > 0 ? user.roles.join(', ') : 'No roles assigned'}
                                </li>
                            </ul>
                        </div>
                    </div>
                    <Link className='btn btn-primary my-2' to='/administration/users'>
                        Back to Users
                    </Link>
                </div>
            </div>
        </div>
    );
}
