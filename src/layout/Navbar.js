import { React, useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:8080/api/user/profile', { credentials: 'include' })
            .then(res => {
                if (!res.ok) throw new Error("User not logged in");
                return res.json();
            })
            .then(data => setUser(data))
            .catch(error => {
                console.error("Error fetching user profile:", error);
                setUser(null);
            });
    }, []);

    const handleLoginClick = () => navigate('/login');
    const handleProfileClick = () => navigate('/api/user/profile');

    return (
        <div>
            <nav className="navbar bg-dark border-bottom border-body" data-bs-theme="dark">
                <div className="container-fluid">
                    <Link className="navbar-brand text-white" to="/">Loripin</Link>
                    <nav className="nav">
                        <Link className="nav-link text-white" to="/catalog">Catalog</Link>
                        <Link className="nav-link text-white" to="/spots">Spots</Link>
                        <Link className="nav-link text-white" to="/autosport">Autosport</Link>
                        <Link className="nav-link text-white" to="/administration">Administration</Link>
                    </nav>
                    <div>
                        {user ? (
                            <div
                                onClick={handleProfileClick}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    cursor: "pointer",
                                    color: "white"
                                }}
                            >
                                <img
                                    src={user.avatarUrl || "/default-avatar.png"}
                                    alt={user.username || "Default Avatar"}
                                    style={{
                                        width: "30px",
                                        height: "30px",
                                        borderRadius: "50%",
                                        marginRight: "8px"
                                    }}
                                />
                                <span>{user.username || user.name}</span>
                            </div>
                        ) : (
                            <button onClick={handleLoginClick} className="btn btn-outline-primary">Log in</button>
                        )}
                    </div>
                </div>
            </nav>
        </div>
    );
}
