import axios from 'axios';
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';

const Profile = () => {
    const [activeUser, setActiveUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [number, setNumber] = useState(0);
    const navigate = useNavigate();
    const { user } = useAuth();

    const loadUser = async () => {
        if (!user || !user.token) {
            setError("Отсутствует токен аутентификации.");
            setLoading(false);
            navigate('/login'); // Перенаправление на страницу входа
            return;
        }

        try {
            const response = await axios.get(`http://localhost:8080/user/profile`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            setActiveUser(response.data);
        } catch (err) {
            console.error('Ошибка загрузки данных:', err);
            if (err.response && err.response.status === 401) {
                // Если токен недействителен, перенаправить на страницу входа
                navigate('/login');
            } else {
                setError("Не удалось загрузить данные профиля.");
            }
        } finally {
            setLoading(false);
        }
    };

    const loadNumber = async () => {
        try {
            const result = await axios.get(`http://localhost:8080/spots/userSpotsNumber`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            setNumber(result.data);
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
        }
    };


    useEffect(() => {
        loadUser();
        loadNumber()
    }, []);

    const handleFileChange = async (event) => {
        const file = event.target.files[0];

        if (!file) {
            setError("Please select a valid file.");
            return;
        }

        const formData = new FormData();
        formData.append("photo", file);

        try {
            const response = await axios.put(
                `http://localhost:8080/user/profile/addPhoto`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${user.token}`
                    },
                }
            );

            if (response.status === 200 || response.status === 201) {
                const uploadedPhoto = response.data; // Backend returns the Photo object, including the name
                setActiveUser((prevSpot) => ({
                    ...prevSpot,
                    photos: [...prevSpot.photos, uploadedPhoto],
                }));
                setError("");
                setSelectedFile(null);
            }
        } catch (err) {
            console.error("Error uploading photo:", err.message);
            setError("Failed to upload photo. Please try again.");
        } finally {
            event.target.value = ""; // Сбрасываем input для загрузки следующего файла
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/user/profile/changePassword`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });

            if (response.ok) {
                setMessage("Password has been successfully changed.");
                setTimeout(() => navigate("/user/profile"), 2000);
            } else {
                const errorData = await response.json();
                setError(errorData.message || "An error occurred.");
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        }
    };

    if (loading) {
        return <div>Загрузка...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className='container'>
            <nav aria-label="breadcrumb" className='mt-3'>
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><a href="/" className="text-decoration-none">Home</a></li>
                    <li className="breadcrumb-item active" aria-current="page">Profile</li>
                </ol>
            </nav>
            <div className="h5 pb-1 mb-3 text-black border-bottom border-black text-start">
                {activeUser.username}
            </div>
            <div>
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4">
                    <div className="col">
                        {activeUser?.avatarUrl ? (
                            <img
                                src={activeUser.avatarUrl}
                                alt="Avatar"
                                className="img-fluid rounded-circle shadow"
                                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                            />
                        ) : (
                            <div className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '150px', height: '150px', fontSize: '2rem' }}>
                                {activeUser?.username.charAt(0).toUpperCase()}
                            </div>
                        )}

                        <div class="mb-3 mt-5">
                            <label for="formFileSm" class="form-label text-start d-block">Change avatar:</label>
                            <input
                                className="form-control form-control-sm"
                                type="file"
                                style={{ width: '200px' }}
                                onChange={handleFileChange}
                                accept="image/*"
                            />
                            {error && <p className="text-danger">{error}</p>}
                        </div>
                    </div>
                    <div className="col text-start">
                        <p>Your account was created {activeUser?.createdAt ? `${formatDistanceToNow(new Date(activeUser.createdAt), { addSuffix: true })}` : 'Неизвестно'}</p>

                        <p>Email: {activeUser?.email}</p>


                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    placeholder="New email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="d-grid">
                                <button type="submit" className="btn btn-primary">
                                    Save email
                                </button>
                            </div>
                            <h5 className='mt-5'>Change password</h5>
                            <div className="mb-3">
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    placeholder="New Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <input
                                    type="password"
                                    className="form-control"
                                    id="confirmPassword"
                                    placeholder="Confirm New Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="d-grid">
                                <button type="submit" className="btn btn-primary">
                                    Save Password
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="col text-start">
                        <h5>Rating: {number}</h5>
                        <p>Spots: {number}</p>
                        <p>Comments: {number}</p>
                        <p>Likes: {number}</p>
                        <p>Subscribers: {number}</p>
                        <p>Subscriptions: {number}</p>
                    </div>
                </div>
            </div>

        </div>

    );
};

export default Profile;
