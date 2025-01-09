import axios from 'axios';
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const [currentUser, setCurrentUser] = useState(null);
    const [error, setError] = useState(null);

    const loadUser = async () => {

        try {
            const response = await axios.get(`http://localhost:8080/user/profile`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            setCurrentUser(response.data);
            console.log("currentUser:", response.data)
        } catch (err) {
            console.error('Ошибка загрузки данных:', err);
            if (err.response && err.response.status === 401) {
                // If token is invalid, redirect to login
                navigate('/login');
            } else {
                setError("Не удалось загрузить данные профиля.");
            }
        }
    };

    useEffect(() => {
        loadUser();
    }, [user]);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const isOnLoginPage = location.pathname === "/login";

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">Loripin</Link>
                {/* Navbar Toggler for smaller screens */}
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    {/* Navbar Links */}
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link text-white" to="/catalog">Catalog</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link text-white" to="/spots">Spots</Link>
                        </li>
                        {user?.roles.includes("ROLE_ADMIN") && (
                            <li className="nav-item">
                                <Link className="nav-link text-white" to="/administration">Administration</Link>
                            </li>
                        )}
                    </ul>

                    <div className="d-flex">
                        {user ? (

                            <ul className="navbar-nav">
                                <li className="btn-group dropstart">
                                    <a
                                        className="nav-link dropdown-toggle-split d-flex align-items-center"
                                        href="#"
                                        id="navbarDarkDropdownMenuLink"
                                        role="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        {/* Avatar */}
                                        {currentUser?.avatarUrl && (
                                            <img
                                                src={`https://newloripinbucket.s3.amazonaws.com/${currentUser?.avatarUrl}`}
                                                alt="Avatar"
                                                className="rounded-circle me-2"
                                                style={{ width: "30px", height: "30px", objectFit: "cover" }}
                                            />
                                        )}
                                        {user.username}
                                    </a>
                                    <ul className="dropdown-menu dropdown-menu-dark" aria-labelledby="navbarDarkDropdownMenuLink">
                                        <li><a className="dropdown-item" href="/user/profile">Profile</a></li>
                                        <li><a
                                            className="dropdown-item"
                                            href={handleLogout}
                                            style={{ cursor: 'pointer' }}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleLogout();
                                            }}
                                        >Sign out</a></li>
                                    </ul>
                                </li>
                            </ul>

                        ) : (
                            // Если пользователь НЕ залогинен, проверяем, не на странице логина ли он
                            !isOnLoginPage && (
                                <Link to="/login" className="btn btn-outline-primary">
                                    Sign in
                                </Link>
                            )
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
