import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

export default function EditUser() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [user, setUser] = useState({
        name: "",
        username: "",
        email: "",
        roleIds: []
    });

    const [allRoles, setAllRoles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        loadUser();
        loadRoles();
    }, []);

    const loadUser = async () => {
        setLoading(true);
        setError("");
        try {
            const result = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/users/${id}`);
            const userData = result.data;

            setUser({
                ...userData,
                roleIds: userData.roleIds || []
            });

        } catch (error) {
            console.error("Error loading user:", error);
            setError("Failed to load user data. Please try again.");
        } finally {
            setLoading(false);
        }
        console.log("User roleIds:", user.roleIds);
        console.log("All roles:", allRoles);
        console.log("User:", user);
    };

    const loadRoles = async () => {
        try {
            const result = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/roles`);
            setAllRoles(result.data);
        } catch (error) {
            console.error("Error loading roles:", error);
            setError("Failed to load roles. Please try again.");
        }
    };

    const onInputChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const onRoleChange = (roleId) => {
        if (user.roleIds.includes(roleId)) {
            setUser({ ...user, roleIds: user.roleIds.filter((id) => id !== roleId) });
        } else {
            setUser({ ...user, roleIds: [...user.roleIds, roleId] });
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.put(`${process.env.REACT_APP_API_URL}/api/admin/users/editUser/${id}`, user);
            navigate('/admin/users');
        } catch (error) {
            console.error("Error updating user:", error);
            setError("Failed to update user. Please try again.");
        }
    };

    return (
        <div className='container'>
            <div className='row'>
                <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow'>
                    <h2 className='text-center m-4'>Edit User</h2>
                    {loading && <div className="alert alert-info">Loading user data...</div>}
                    {error && <div className="alert alert-danger">{error}</div>}
                    <form onSubmit={(e) => onSubmit(e)}>
                        <div className='mb-3'>
                            <label htmlFor='Name' className='form-label'>Name</label>
                            <input
                                type={'text'}
                                className='form-control'
                                placeholder='Enter your name'
                                name='name'
                                value={user.name}
                                onChange={onInputChange}
                                disabled={loading}
                            />
                        </div>
                        <div className='mb-3'>
                            <label htmlFor='Username' className='form-label'>Username</label>
                            <input
                                type={'text'}
                                className='form-control'
                                placeholder='Enter your username'
                                name='username'
                                value={user.username}
                                onChange={onInputChange}
                                disabled={loading}
                            />
                        </div>
                        <div className='mb-3'>
                            <label htmlFor='Email' className='form-label'>Email</label>
                            <input
                                type={'email'}
                                className='form-control'
                                placeholder='Enter your email'
                                name='email'
                                value={user.email}
                                onChange={onInputChange}
                                disabled={loading}
                            />
                        </div>
                        <div className='mb-3'>
                            <label className='form-label'>Assign Roles</label>
                            <div>
                                {allRoles.map((role) => (
                                    <div key={role.id} className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id={`role-${role.id}`}
                                            checked={user.roleIds.includes(role.id)}
                                            onChange={() => onRoleChange(role.id)}
                                        />
                                        <label className="form-check-label" htmlFor={`role-${role.id}`}>
                                            {role.name}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button type='submit' className="btn btn-outline-primary" disabled={loading}>
                            Submit
                        </button>
                        <Link className="btn btn-outline-danger mx-2" to='/admin/users'>
                            Cancel
                        </Link>
                    </form>
                </div>
            </div>
        </div>
    );
}