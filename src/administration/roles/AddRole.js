import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AddRole() {

    let navigate = useNavigate();

    const [role, setRole] = useState({
        name: ""
    });
    const [success, setSuccess] = useState(false);

    const { name } = role;
    const { user } = useAuth();

    const onInputChange = (e) => {
        setRole({ ...role, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            alert("Role name cannot be empty.");
            return;
        }

        try {
            await axios.post('http://localhost:8080/administration/roles/addRole', role, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            setSuccess(true);
            setRole({ name: "" }); // Очистка формы
            setTimeout(() => {
                navigate('/administration/roles');
            }, 2000);
        } catch (error) {
            console.error("Error adding role", error);
            alert("Failed to add role. Please try again.");
        }
    };

    return (
        <div className='container'>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb mt-3">
                    <li className="breadcrumb-item"><a href="/" className="text-decoration-none">Home</a></li>
                    <li className="breadcrumb-item"><a href='/administration' className="text-decoration-none">Administration</a></li>
                    <li className="breadcrumb-item"><a href='/administration/roles' className="text-decoration-none">Roles</a></li>
                    <li className="breadcrumb-item active" aria-current="page">Add role</li>
                </ol>
            </nav>
            <div className='row'>
                <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow'>
                    <h2 className='text-center m-4'>Add Role</h2>
                    {success && <div className="alert alert-success">Role added successfully!</div>}
                    <form onSubmit={(e) => onSubmit(e)}>
                        <div className='mb-3'>
                            <label htmlFor='Name' className='form-label'>Name</label>
                            <input
                                type={'text'}
                                className='form-control'
                                placeholder='Enter role'
                                name='name'
                                value={name}
                                onChange={(e) => onInputChange(e)}
                            />
                            <small className="form-text text-muted">The role name should be unique and descriptive.</small>
                        </div>
                        <button type='submit' className="btn btn-outline-primary" disabled={!name.trim()}>
                            Submit
                        </button>
                        <Link className="btn btn-outline-danger mx-2" to='/administration/roles'>
                            Cancel
                        </Link>
                    </form>
                </div>
            </div>
        </div>
    );
}
