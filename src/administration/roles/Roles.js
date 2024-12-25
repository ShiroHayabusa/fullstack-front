import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';

export default function Roles() {

    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const { id } = useParams();

    useEffect(() => {
        loadRoles();
    }, []);

    const loadRoles = async () => {
        setLoading(true);
        setError("");
        try {
            const result = await axios.get("http://localhost:8080/administration/roles");
            setRoles(result.data);
        } catch (error) {
            console.error("Error loading roles:", error);
            setError("Failed to load roles. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const deleteRole = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this role?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`http://localhost:8080/administration/roles/${id}`);
            loadRoles();
        } catch (error) {
            console.error("Error deleting role:", error);
            setError("Failed to delete role. Please try again.");
        }
    };

    return (
        <div>
            <ul className="nav">
                <li className="nav-item">
                    <Link className="nav-link active" aria-current="page" 
                          to='/administration/roles/addRole'>Add Role</Link>
                </li>
            </ul>
            <div className='container'>
                <div className='py-4'>
                    {loading && <div className="alert alert-info">Loading roles...</div>}
                    {error && <div className="alert alert-danger">{error}</div>}
                    <table className="table border shadow">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Name</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {roles.length > 0 ? (
                                roles.map((role, index) => (
                                    <tr key={role.id}>
                                        <th scope="row">{index + 1}</th>
                                        <td>{role.name}</td>
                                        <td>
                                            <Link className='btn btn-primary mx-2'
                                                  to={`/administration/roles/viewRole/${role.id}`}>View</Link>
                                            <Link className='btn btn-outline-primary mx-2'
                                                  to={`/administration/roles/editRole/${role.id}`}>Edit</Link>
                                            <button className='btn btn-danger mx-2'
                                                    onClick={() => deleteRole(role.id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="text-center">No roles available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
