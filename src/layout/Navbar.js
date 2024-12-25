import { React, useEffect, useState } from "react";
import { Link, useNavigate} from 'react-router-dom'

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
            .catch(() => setUser(null));
    }, []);

    const handleLoginClick = () => {
        navigate('/login'); // Перенаправляем на страницу логина
    };

    const handleProfileClick = () => {
        navigate('/api/user/profile'); // Перенаправляем на страницу профиля
    };


    return (
        <div>
            <nav className="navbar bg-dark" data-bs-theme="dark">
                <div className="container-fluid">
                    <Link className="navbar-brand text-white" to={'/'}>Loripin</Link>
                    <nav class="nav">
                        <Link class="nav-link text-white" to='/catalog'>Catalog</Link>
                        <Link class="nav-link text-white" to='/spots'>Spots</Link>
                        <Link class="nav-link text-white" to='/autosport'>Autosport</Link>
                        <Link class="nav-link text-white" to='/administration'>Administration</Link>
                        <div>
                        {user ? (
                            <div onClick={handleProfileClick} style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                                <img
                                    src={user.avatarUrl || "/default-avatar.png"}
                                    alt="Avatar"
                                />
                                <span>{user.username || user.name}</span>
                            </div>
                        ) : (
                            <button onClick={handleLoginClick}>Log in</button>
                        )}
                    </div>
                    </nav>

                    <button className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent"
                        aria-expanded="false"
                        aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                </div>
            </nav>

        </div>
    )
}
