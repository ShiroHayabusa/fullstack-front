import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function EditRole() {
    let navigate = useNavigate();
    const { id } = useParams();

    const [role, setRole] = useState({
        name: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const { name } = role;
    const { user } = useAuth();

    const onInputChange = (e) => {
        setRole({ ...role, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        loadRole();
    }, []);

    const onSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            setError("Role name cannot be empty.");
            return;
        }

        try {
            await axios.put(`http://localhost:8080/administration/roles/editRole/${id}`, role, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            navigate('/administration/roles');
        } catch (error) {
            console.error("Error updating role", error);
            setError("Failed to update the role. Please try again.");
        }
    };

    const loadRole = async () => {
        setLoading(true);
        setError("");
        try {
            const result = await axios.get(`http://localhost:8080/administration/roles/${id}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            setRole(result.data);
        } catch (error) {
            console.error("Error loading role", error);
            setError("Failed to load the role. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='container'>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb mt-3">
                    <li className="breadcrumb-item"><a href="/" className="text-decoration-none">Home</a></li>
                    <li className="breadcrumb-item"><a href='/administration' className="text-decoration-none">Administration</a></li>
                    <li className="breadcrumb-item"><a href='/administration/roles' className="text-decoration-none">Roles</a></li>
                    <li className="breadcrumb-item active" aria-current="page">Edit role {role.name}</li>
                </ol>
            </nav>
            <div className='row'>
                <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow'>
                    <h2 className='text-center m-4'>Edit Role</h2>

                    {loading && <div className="alert alert-info">Loading role...</div>}
                    {error && <div className="alert alert-danger">{error}</div>}

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
                                disabled={loading}
                            />
                        </div>
                        <button
                            type='submit'
                            className="btn btn-outline-primary"
                            disabled={!name.trim() || loading}
                        >
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
