import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [isNewUser, setIsNewUser] = useState(false);
    const [username, setUsername] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:8080/api/user/profile', { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                if (data.status === "new") {
                    setIsNewUser(true);
                } else {
                    setUser(data);
                }
            })
            .catch(err => console.error(err));
    }, []);

    const handleUsernameSubmit = () => {
        fetch('/api/user/username', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username }),
            credentials: 'include',
        })
            .then(() => {
                setIsNewUser(false);
                navigate("/profile");
            })
            .catch(err => console.error(err));
    };

    const handleLogout = () => {
        const googleLogoutUrl = 'https://accounts.google.com/Logout';
    
        // Завершаем сессию на сервере
        fetch('http://localhost:8080/logout', {
            method: 'POST',
            credentials: 'include',
        })
            .then(() => {
                // Перенаправляем на URL выхода Google
                window.location.href = googleLogoutUrl;
            })
            .catch((error) => {
                console.error('Logout error:', error);
            });
    };

    if (isNewUser) {
        return (
            <div>
                <h1>Create Your Username</h1>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                />
                <button onClick={handleUsernameSubmit}>Submit</button>
            </div>
        );
    }

    if (!user) return <p>Loading...</p>;

    return (
        <div>
            <h1>Welcome, {user.name}</h1>
            <img src={user.avatarUrl} alt="Avatar" />
            <p>Email: {user.email}</p>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Profile;