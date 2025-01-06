import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const isOnLoginPage = location.pathname === "/login";

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">Loripin</Link>
                <nav className="nav">
                    <Link className="nav-link text-white" to="/catalog">Catalog</Link>
                    <Link className="nav-link text-white" to="/spots">Spots</Link>
                    {user?.roles.includes("ROLE_ADMIN") && (
                        <Link className="nav-link text-white" to="/administration">Administration</Link>
                    )}
                </nav>
                <div className="d-flex">
                    {user ? (
                        <div className="collapse navbar-collapse dropstart" id="navbarNavDarkDropdown">
                            <ul className="navbar-nav">
                                <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle" href="#" id="navbarDarkDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
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
                        </div>
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
        </nav>
    );
};

export default Navbar;
