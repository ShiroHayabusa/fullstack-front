import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Users() {

    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]); // Храним данные всех ролей
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        loadUsers();
        loadRoles(); // Загрузка всех ролей при инициализации
    }, []);

    const loadUsers = async () => {
        setLoading(true);
        setError("");
        try {
            const result = await axios.get("http://localhost:8080/users");
            setUsers(result.data); // Загрузка данных пользователей
        } catch (error) {
            console.error("Error loading users:", error);
            setError("Failed to load users. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const loadRoles = async () => {
        try {
            const result = await axios.get("http://localhost:8080/administration/roles");
            setRoles(result.data); // Загрузка данных всех ролей
        } catch (error) {
            console.error("Error loading roles:", error);
            setError("Failed to load roles. Please try again.");
        }
    };

    const deleteUser = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this user?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`http://localhost:8080/user/${id}`);
            loadUsers();
        } catch (error) {
            console.error("Error deleting user:", error);
            alert("Failed to delete user. Please try again.");
        }
    };

    const getRoleNames = (roleIds) => {
        if (!Array.isArray(roleIds) || roleIds.length === 0) return "No roles";
        return roleIds
            .map(roleId => {
                const role = roles.find(r => r.id === roleId);
                return role ? role.name : null; // Найти название роли
            })
            .filter(roleName => roleName !== null) // Удалить `null` для отсутствующих ролей
            .join(', ');
    };

    return (
        <div>
            <div className='container'>
                <div className='py-4'>
                    <h2 className="text-center mb-4">User Management</h2>
                    {loading && <div className="alert alert-info">Loading users...</div>}
                    {error && <div className="alert alert-danger">{error}</div>}
                    <table className="table border shadow">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Name</th>
                                <th scope="col">Username</th>
                                <th scope="col">Email</th>
                                <th scope="col">Roles</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length > 0 ? (
                                users.map((user, index) => (
                                    <tr key={user.id}>
                                        <th scope="row">{index + 1}</th>
                                        <td>{user.name}</td>
                                        <td>{user.username}</td>
                                        <td>{user.email}</td>
                                        <td>{getRoleNames(user.roleIds)}</td> {/* Отображение ролей */}
                                        <td>
                                            <Link
                                                className='btn btn-primary mx-2'
                                                to={`/administration/users/viewUser/${user.id}`}
                                            >
                                                View
                                            </Link>
                                            <Link
                                                className='btn btn-outline-primary mx-2'
                                                to={`/administration/users/editUser/${user.id}`}
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                className='btn btn-danger mx-2'
                                                onClick={() => deleteUser(user.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center">
                                        No users available
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
