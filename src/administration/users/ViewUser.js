import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const UserDetail = () => {
    const { userId } = useParams();
    const [userEntity, setUserEntity] = useState(null);
    const [roles, setRoles] = useState([]);
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            fetch(`${process.env.REACT_APP_API_URL}/api/admin/users/${userId}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    setUserEntity(data);
                    setRoles(data.roles || []);
                })
                .catch((error) => console.error("Error fetching user:", error));
        }
    }, [user, userId]);

    const toggleRole = (roleName) => {
        if (roles.includes(roleName)) {
            setRoles(roles.filter((role) => role !== roleName));
        } else {
            setRoles([...roles, roleName]);
        }
    };

    const saveRoles = async () => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_URL}/api/admin/users/${userId}/assign-role`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({ roles }),
                }
            );

            if (response.ok) {
                navigate("/admin/users");
            } else {
                const errorData = await response.json();
                alert(errorData.message || "Failed to update roles");
            }
        } catch (error) {
            console.error("Error updating roles:", error);
            alert("An error occurred. Please try again.");
        }
    };

    if (!userEntity) {
        return <p>Loading user details...</p>;
    }

    return (
        <div className="container">
            <nav aria-label="breadcrumb" className="mt-3">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><a href="/" className="text-decoration-none">Home</a></li>
                    <li className="breadcrumb-item"><a href="/admin" className="text-decoration-none">Administration</a></li>
                    <li className="breadcrumb-item"><a href="/admin/users" className="text-decoration-none">Users</a></li>
                    <li className="breadcrumb-item active" aria-current="page">{userEntity.username}</li>
                </ol>
            </nav>
            <h1>User Details</h1>
            <p className="text-start">
                <strong>ID:</strong> {userEntity.id}
            </p>
            <p className="text-start">
                <strong>Username:</strong> {userEntity.username}
            </p>
            <p className="text-start">
                <strong>Email:</strong> {userEntity.email}
            </p>
            <div className="text-start">
                <h3>Roles</h3>
                <div>
                    {["ROLE_USER", "ROLE_ADMIN"].map((role) => (
                        <div key={role}>
                            <input
                                type="checkbox"
                                checked={roles.includes(role)}
                                onChange={() => toggleRole(role)}
                            />
                            <label className="ms-2">{role}</label>
                        </div>
                    ))}
                </div>
            </div>
            <button className="btn btn-success mt-3" onClick={saveRoles}>
                Save Roles
            </button>
        </div>
    );
};

export default UserDetail;
