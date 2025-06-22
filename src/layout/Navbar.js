import axios from 'axios';
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Dropdown, Button } from 'react-bootstrap';
import AsyncSelect from 'react-select/async';
import debounce from 'lodash.debounce';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const [currentUser, setCurrentUser] = useState(null);
    const [error, setError] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);

    const loadUser = async () => {

        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/profile`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            setCurrentUser(response.data);
        } catch (err) {
            console.error('Error loading data:', err);
            if (err.response && err.response.status === 401) {
                navigate('/login');
            } else {
                setError("Failed to load profile data.");
            }
        }
    };

    const debouncedSearch = debounce((inputValue, callback) => {
        fetch(`${process.env.REACT_APP_API_URL}/api/search?query=${inputValue}`)
            .then(res => res.json())
            .then(data => {
                const options = data.map(item => ({
                    value: item.url,
                    label: `${item.name}`,
                }));
                callback(options);
            });
    }, 300);

    const handleChange = (selectedOption) => {
        if (selectedOption && selectedOption.value) {
            navigate(selectedOption.value);
            setSelectedOption(null);
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
                <Link className="navbar-brand" to="/">
                    <img
                        src="https://newloripinbucket.s3.amazonaws.com/image/logo/logo2.svg"
                        alt="Logo"
                        width="30"
                        height="24"
                        style={{ filter: "invert(1)" }}
                        className="d-inline-block align-text-top me-2"
                    />
                    Loripin
                </Link>
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
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        {user?.token ? (
                            <li className="nav-item">
                                <Link className="nav-link text-secondary" to="/feed">Feed</Link>
                            </li>
                        ) : null}
                        {user?.token ? (
                            <li className="nav-item">
                                <Link className="nav-link text-secondary" to="/myspots">My spots</Link>
                            </li>
                        ) : null}
                        <li className="nav-item">
                            <Link className="nav-link text-secondary" to="/unidentified">Unidentified</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link text-secondary" to="/catalog">Catalog</Link>
                        </li>
                        {user?.roles.includes("ROLE_ADMIN") && (
                            <li className="nav-item">
                                <Link className="nav-link text-secondary" to="/admin">Admin</Link>
                            </li>
                        )}
                        <li className="nav-item">

                        </li>
                    </ul>

                    <div className="d-flex d-flex justify-content-between align-items-center">
                        <div style={{ width: "200px" }}>
                            <AsyncSelect
                                value={selectedOption}
                                cacheOptions
                                loadOptions={debouncedSearch}
                                onChange={handleChange}
                                placeholder="Search..."
                                styles={{
                                    container: (base) => ({
                                        ...base,
                                        width: "100%",
                                    }),
                                    menu: (base) => ({
                                        ...base,
                                        zIndex: 9999,
                                        textAlign: "left",
                                    }),
                                    singleValue: (base) => ({
                                        ...base,
                                        textAlign: "left",
                                    }),
                                    option: (base) => ({
                                        ...base,
                                        textAlign: "left",
                                    }),
                                    placeholder: (base) => ({
                                        ...base,
                                        textAlign: "left",
                                    }),
                                }}
                            />

                        </div>
                        <div>
                            {user ? (
                                <Dropdown align="end">
                                    <Dropdown.Toggle
                                        variant="link"
                                        id="userDropdown"
                                        className="d-flex align-items-center"
                                        aria-expanded="false"
                                        style={{
                                            border: 'none',
                                            textDecoration: 'none',
                                            color: 'white'
                                        }}
                                    >
                                        {currentUser?.avatarUrl && (
                                            <img
                                                src={`https://newloripinbucket.s3.amazonaws.com/${currentUser?.avatarUrl}`}
                                                alt="Avatar"
                                                className="rounded-circle me-2"
                                                style={{ width: "30px", height: "30px", objectFit: "cover" }}
                                            />
                                        )}
                                        {user.username}
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu className="dropdown-menu-dark">
                                        <Dropdown.Item as={Link} to="/user/profile">
                                            Profile
                                        </Dropdown.Item>
                                        <Dropdown.Item as="button" onClick={handleLogout}>
                                            Sign out
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            ) : (
                                !isOnLoginPage && (
                                    <Link to="/login" className="btn btn-outline-light ms-3">
                                        Sign in
                                    </Link>
                                )
                            )}
                        </div>
                    </div>


                </div>
            </div>
        </nav>
    );
};

export default Navbar;
