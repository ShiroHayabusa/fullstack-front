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
                        <div>
                            <span className="text-white me-3">{user.username}</span>
                            <button className="btn btn-outline-light" onClick={handleLogout}>
                                Sign out
                            </button>
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
