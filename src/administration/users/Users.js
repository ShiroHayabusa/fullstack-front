import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const UserList = () => {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {

        if (!user) {
            navigate('/login');
        } else {
            fetch("http://localhost:8080/api/admin/users", {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            })
                .then((response) => response.json())
                .then((data) => setUsers(data))
                .catch((error) => console.error("Error fetching users:", error));
        }
    }, [user]);

    const viewUser = (userId) => {
        navigate(`/administration/users/${userId}`);
    };

    return (
        <div className="container">
            <nav aria-label="breadcrumb" className="mt-3">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><a href="/" className="text-decoration-none">Home</a></li>
                    <li className="breadcrumb-item"><a href="/administration" className="text-decoration-none">Administration</a></li>
                    <li className="breadcrumb-item active" aria-current="page">Users</li>
                </ol>
            </nav>
            <h1>User List</h1>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th className="text-start">ID</th>
                        <th className="text-start">Username</th>
                        <th className="text-start">Email</th>
                        <th className="text-start">Roles</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td className="text-start">{user.id}</td>
                            <td className="text-start">{user.username}</td>
                            <td className="text-start">{user.email}</td>
                            <td className="text-start">{user.roles.join(", ")}</td>
                            <td>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => viewUser(user.id)}
                                >
                                    View User
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserList;
