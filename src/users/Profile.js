import axios from 'axios';
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { formatDistanceToNow, set } from 'date-fns';
import Select from "react-select";


const Profile = () => {
    const [currentUser, setCurrentUser] = useState(null);

    const [loading, setLoading] = useState(true);
    const [selectedFile, setSelectedFile] = useState(null);

    const [bio, setBio] = useState("");
    const [bioDirty, setBioDirty] = useState(false);
    const [bioMessage, setBioMessage] = useState("");
    const [bioError, setBioError] = useState("");

    const [email, setEmail] = useState("");
    const [confirmEmail, setConfirmEmail] = useState("");
    const [showChangeEmailForm, setShowChangeEmailForm] = useState(false);

    const [password, setPassword] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState(null);

    const [avatarMessage, setAvatarMessage] = useState("");
    const [avatarError, setAvatarError] = useState(null);

    const [emailMessage, setEmailMessage] = useState("");
    const [emailError, setEmailError] = useState(null);

    const [uploading, setUploading] = useState(false);
    const [stats, setStats] = useState({
        spots: 0,
        comments: 0,
    });

    const [achievements, setAchievements] = useState([]);

    const [city, setCity] = useState('');
    const [region, setRegion] = useState('');
    const [country, setCountry] = useState('');
    const [cityOptions, setCityOptions] = useState([]);
    const [selectedCity, setSelectedCity] = useState("");
    const [cityInputValue, setCityInputValue] = useState('');
    const [cityDirty, setCityDirty] = useState(false);
    const [cityMessage, setCityMessage] = useState("");
    const [cityError, setCityError] = useState("");

    const navigate = useNavigate();
    const { user } = useAuth();

    const loadUser = async () => {
        if (!user || !user.token) {
            setError("Authentication token missing");
            setLoading(false);
            navigate('/login');
            return;
        }

        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/profile`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            setCurrentUser(response.data);
            setEmail(response.data.email || "");
            setBio(response.data.bio || "");
            setCity(response.data.city || "");
            setRegion(response.data.region || "");
            setCountry(response.data.country || "");
            if (response.data.city && response.data.country) {
                const savedCityOption = {
                    value: null,
                    city: response.data.city,
                    region: response.data?.region,
                    country: response.data.country,
                    label: response.data.region
                        ? `${response.data.city}, ${response.data.region}, ${response.data.country}`
                        : `${response.data.city}, ${response.data.country}`,
                };
                setSelectedCity(savedCityOption);
                setCityInputValue(savedCityOption.label);
            }
            else {
                setSelectedCity(null);
            }

        } catch (err) {
            console.error('Error loading data:', err);
            if (err.response && err.response.status === 401) {
                navigate('/login');
            } else {
                setError("Failed to load profile data.");
            }
        } finally {
            setLoading(false);
        }
    };

    const loadAchievements = async () => {
        const result = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/profile/${currentUser.id}/achievements`);
        setAchievements(result.data);
    };

    useEffect(() => {
        if (currentUser) {
            loadAchievements();
        }
    }, [currentUser?.id]);

    const milestoneAchievements = achievements.filter(a =>
        a.achievement?.code?.startsWith("SPOT_")
    );

    const firstPlaceAchievements = achievements.filter(a =>
        a.achievement?.code?.startsWith("FIRST_IN_CITY") ||
        a.achievement?.code?.startsWith("FIRST_IN_COUNTRY")
    );

    const firstInCityCount = achievements.filter(a =>
        a.achievement?.code?.startsWith("FIRST_SPOT_CITY") ||
        a.achievement?.code?.startsWith("FIRST_MAKE_CITY") ||
        a.achievement?.code?.startsWith("FIRST_MODEL_CITY") ||
        a.achievement?.code?.startsWith("FIRST_GENERATION_CITY") ||
        a.achievement?.code?.startsWith("FIRST_TRIM_CITY")
    ).length;

    const firstInCountryCount = achievements.filter(a =>
        a.achievement?.code?.startsWith("FIRST_SPOT_COUNTRY") ||
        a.achievement?.code?.startsWith("FIRST_MAKE_COUNTRY") ||
        a.achievement?.code?.startsWith("FIRST_MODEL_COUNTRY") ||
        a.achievement?.code?.startsWith("FIRST_GENERATION_COUNTRY") ||
        a.achievement?.code?.startsWith("FIRST_TRIM_COUNTRY")
    ).length;

    const cityIconUrl = "https://newloripinbucket.s3.amazonaws.com/image/icons/first_in_city.png";
    const countryIconUrl = "https://newloripinbucket.s3.amazonaws.com/image/icons/first_in_country.png";

    useEffect(() => {
        const fetchData = async () => {
            await loadUser();
        };
        fetchData();
    }, [user]);


    useEffect(() => {
        if (avatarMessage) {
            const timer = setTimeout(() => {
                setAvatarMessage('');
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [avatarMessage]);

    useEffect(() => {
        if (emailMessage) {
            const timer = setTimeout(() => {
                setEmailMessage('');
            }, 6000);

            return () => clearTimeout(timer);
        }
    }, [emailMessage]);

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage('');
            }, 6000);

            return () => clearTimeout(timer);
        }
    }, [message]);


    const handleBioChange = (e) => {
        setBio(e.target.value);
        setBioDirty(true);
    };

    const handleBioSave = async () => {
        try {
            const response = await axios.put(
                `${process.env.REACT_APP_API_URL}/api/users/update`,
                {
                    bio,
                    username: currentUser.username
                },
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            if (response.status === 200) {
                setCurrentUser((prev) => ({ ...prev, bio }));
                setBioDirty(false);
                setBioMessage("Bio saved successfully.");
                setBioError("");
            }
        } catch (err) {
            console.error("Failed to save Bio:", err);
            setBioError("Failed to save Bio.");
        }
    };


    const handleFileChange = async (event) => {
        const file = event.target.files[0];

        if (!file) {
            setAvatarError("Please select a valid file.");
            return;
        }

        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            setAvatarError("Invalid file type. Only JPG, PNG, WEBP and GIF are allowed.");
            return;
        }

        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            setAvatarError("File size exceeds the maximum limit of 5MB.");
            return;
        }

        const formData = new FormData();
        formData.append("photo", file);

        try {
            const response = await axios.put(
                `${process.env.REACT_APP_API_URL}/api/user/profile/updateAvatar`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${user.token}`
                    },
                }
            );

            if (response.status === 200 || response.status === 201) {
                const updatedAvatarUrl = `${response.data?.avatarUrl}`;
                const updatedUser = response.data;
                setCurrentUser((prev) => ({
                    ...prev,
                    avatarUrl: updatedAvatarUrl,
                }));
                setAvatarMessage("Avatar updated successfully.");
                setAvatarError("");
                setSelectedFile(null);
            }
        } catch (err) {
            console.error("Error uploading photo:", err.message);
            const errorMsg = err.response?.data || "Failed to upload photo. Please try again.";
            setAvatarError(errorMsg);
        } finally {
            setUploading(false);
            event.target.value = "";
        }
    };

    const toggleChangeEmailForm = () => {
        setShowChangeEmailForm((prev) => !prev);
        setEmail("");
        setConfirmEmail("");
    };

    const toggleChangePasswordForm = () => {
        setShowChangePasswordForm((prev) => !prev);
        setPassword("");
        setConfirmPassword("");
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        setMessage('');
        setError('');

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/user/profile/change-password`,
                {
                    oldPassword,
                    newPassword: password,
                },
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status == 200) {
                const data = response.data;
                setMessage(data.message || 'Password changed successfully.');
                setOldPassword('');
                setPassword('');
                setConfirmPassword('');

            }
        } catch (err) {
            console.error('Error during password change:', err);
            if (err.response && err.response.data) {
                setError(err.response.data.message || 'Failed to change password.');
            } else {
                setError('An error has occurred. Please try again later..');
            }
        } finally {
            setShowChangePasswordForm(false);
        }
    };

    const handleEmailSubmit = async (e) => {
        e.preventDefault();

        if (email !== confirmEmail) {
            setEmailError("Emails do not match.");
            return;
        }

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/user/profile/changeEmail`,
                { email },
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            if (response.status === 200) {
                setEmailMessage(response.data);
                setEmailError("");
                setShowChangeEmailForm(false);
            }
        } catch (err) {
            console.error("Error changing email:", err);
            const errorMsg = err.response?.data?.message || "An error occurred.";
            setEmailError(errorMsg);
        }
    };

    const loadUserStats = async () => {
        if (!user || !user.token) return;

        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/users/${currentUser.id}/stats`,
                {
                    headers: { Authorization: `Bearer ${user.token}` },
                }
            );
            setStats(response.data);
        } catch (error) {
            console.error("Failed to fetch user stats:", error);
        }
    };

    useEffect(() => {
        if (currentUser) {
            loadUserStats();
        }
    }, [currentUser]);

    if (loading) {
        return <div>Loading...</div>;
    }

    const handleCityInput = async (inputValue) => {
        if (!inputValue || inputValue.length <= 2) {
            setCityOptions([]);
            return;
        }
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/places/autocomplete`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
                params: {
                    input: inputValue,
                    types: "(cities)",
                },
            });
            if (response.data && response.data.predictions) {
                const suggestions = response.data.predictions.map(prediction => {
                    const secondaryText = prediction.structured_formatting.secondary_text || "";
                    const parts = secondaryText.split(',').map(p => p.trim());

                    const city = prediction.structured_formatting.main_text;
                    let region = "";
                    let country = "";
                    console.log("parts:", parts[parts.length - 2]);
                    if (parts.length >= 2) {
                        region = parts[parts.length - 2];
                        console.log("region:", region);
                        country = parts[parts.length - 1];
                    } else if (parts.length === 2) {
                        country = parts[1];
                    } else if (parts.length === 1) {
                        country = parts[0];
                    }

                    return {
                        value: prediction.place_id,
                        label: prediction.description,
                        city: city,
                        region: region,
                        country: country,
                    };
                });
                console.log("Suggestions:", suggestions);
                setCityOptions(suggestions);
            } else {
                console.error("Empty result from backend:", response.data);
                setCityOptions([]);
            }
        } catch (error) {
            console.error("Error loading cities:", error);
        }

    };

    const handleCitySelect = (selectedOption) => {
        if (selectedOption) {
            setSelectedCity(selectedOption);
            setCityInputValue(selectedOption.label);
            setCity(selectedOption.city);
            setRegion(selectedOption.region);
            setCountry(selectedOption.country);
            setCityDirty(true);
            setCityError("");
        } else {
            setSelectedCity(null);
            setCityInputValue('');
            setCity('');
            setRegion('');
            setCountry('');
            setCityDirty(true);
        }
    };

    const handleCitySave = async (e) => {
        if (e) e.preventDefault();
        try {
            const response = await axios.put(
                `${process.env.REACT_APP_API_URL}/api/users/updateCity`,
                {
                    city: city || null,
                    region: region || null,
                    country: country || null,
                },
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            if (response.status === 200) {
                setCityDirty(false);
                setCityMessage(
                    city ? "City saved successfully." : "City removed successfully."
                );
                setCityError("");

                if (!city) {
                    setSelectedCity(null);
                    setCityInputValue('');
                }
            }
        } catch (err) {
            console.error("Failed to save city:", err);
            setCityError("Failed to save city.");
        }
        console.log("City saved:", city, region, country);
    };



    return (
        <div className='container'>
            <nav aria-label="breadcrumb" className='mt-3'>
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><a href="/" className="text-decoration-none">Home</a></li>
                    <li className="breadcrumb-item active" aria-current="page">Profile</li>
                </ol>
            </nav>
            <div className="h5 pb-1 mb-3 text-black border-bottom border-black text-start">
                {currentUser?.username}
            </div>
            <div>
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3">
                    <div className="col mb-4">
                        {currentUser?.avatarUrl ? (
                            <img
                                src={`https://newloripinbucket.s3.amazonaws.com/${currentUser?.avatarUrl}`}
                                alt="Avatar"
                                className="img-fluid rounded-circle shadow"
                                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                            />
                        ) : (
                            <div className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '150px', height: '150px', fontSize: '2rem' }}>
                                {currentUser?.username.charAt(0).toUpperCase()}
                            </div>
                        )}

                        <div className="mb-3 mt-3">
                            <div className="mb-3 mt-3">
                                {uploading ? (
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Uploading...</span>
                                    </div>
                                ) : (
                                    <>
                                        <h6 className='mt-4 mb-3 text-start'>Change avatar:</h6>
                                        <input
                                            className="form-control form-control-sm"
                                            type="file"
                                            onChange={handleFileChange}
                                            accept="image/*"
                                        />
                                    </>
                                )}
                                {avatarError && <p className="text-danger">{avatarError}</p>}
                                {avatarMessage && <div className="alert alert-success mt-3" role="alert">{avatarMessage}</div>}
                            </div>
                        </div>
                        <h5 className='mt-4 text-start'>Achievements</h5>
                        {milestoneAchievements.length > 0 && (
                            <div className="mt-2 d-flex flex-wrap">
                                {milestoneAchievements.map((achievement) => (
                                    <div key={achievement.id} className="text-center me-3 mb-3">
                                        <div className="d-flex flex-column align-items-center">
                                            <img
                                                src={`https://newloripinbucket.s3.amazonaws.com/image/${achievement.achievement?.iconUrl}`}
                                                style={{ width: 'auto', height: '75px' }}
                                                alt={`${achievement.achievement?.name} logo`}
                                                className='img-fluid'
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {(firstInCityCount > 0 || firstInCountryCount > 0) && (
                            <div className="d-flex flex-wrap border-top pt-3">
                                {firstInCountryCount > 0 && (
                                    <div className="text-center me-3 mb-3">
                                        <Link to={`/profile/achievements/country/${currentUser.id}`} className="text-decoration-none text-dark">
                                            <div className="d-flex flex-column align-items-center">
                                                <img
                                                    src={countryIconUrl}
                                                    style={{ width: 'auto', height: '75px' }}
                                                    alt="First in Country"
                                                    className='img-fluid'
                                                />
                                                <div className="text-muted fw-bold fs-5">{firstInCountryCount}</div>
                                            </div>
                                        </Link>
                                    </div>
                                )}
                                {firstInCityCount > 0 && (
                                    <div className="text-center me-3 mb-3">
                                        <Link to={`/profile/achievements/city/${currentUser.id}`} className="text-decoration-none text-dark">
                                            <div className="d-flex flex-column align-items-center">
                                                <img
                                                    src={cityIconUrl}
                                                    style={{ width: 'auto', height: '75px' }}
                                                    alt="First in City"
                                                    className='img-fluid'
                                                />
                                                <div className="text-muted fw-bold fs-5">{firstInCityCount}</div>
                                            </div>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}

                    </div>

                    <div className="col text-start">
                        <p>Your account was created <strong>{currentUser?.createdAt ? `${formatDistanceToNow(new Date(currentUser.createdAt), { addSuffix: true })}` : 'Неизвестно'}</strong></p>
                        <p>
                            <strong>Email: </strong>{currentUser?.email}{" "}

                        </p>

                        <div className="form-floating mb-3">
                            <textarea
                                className="form-control"
                                id="floatingTextarea2"
                                style={{ height: '310px' }}
                                name="bio"
                                value={bio}
                                onChange={handleBioChange}
                            >
                            </textarea>
                            <label htmlFor="floatingTextarea2">Bio</label>
                        </div>
                        {bioDirty && (
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleBioSave}
                            >
                                Save
                            </button>
                        )}
                        {bioError && (
                            <div className="alert alert-danger mt-3" role="alert">
                                {bioError}
                            </div>
                        )}
                        <strong>City: </strong>
                        <form className='mb-3'
                            onSubmit={handleCitySave}>
                            <Select
                                options={cityOptions}
                                value={selectedCity}
                                onInputChange={(value) => {
                                    setCityInputValue(value);
                                    handleCityInput(value);
                                }}
                                onChange={(selectedOption) => {
                                    handleCitySelect(selectedOption);
                                }}
                                isSearchable
                                placeholder="Enter city..."
                                isClearable
                            />

                            {cityDirty && (
                                <button
                                    type="submit"
                                    className="btn btn-primary mt-2"
                                >
                                    Save
                                </button>
                            )}
                            {cityError && (
                                <div className="alert alert-danger mt-3" role="alert">
                                    {cityError}
                                </div>
                            )}
                        </form>

                        <p>
                            <button
                                className="btn btn-sm btn-link text-primary p-0 mt-3 text-decoration-none"
                                onClick={toggleChangeEmailForm}
                            >
                                Change email
                            </button>
                        </p>

                        {showChangeEmailForm && (
                            <form onSubmit={handleEmailSubmit}>
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
                                <div className="mb-3">
                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="Confirm new email"
                                        value={confirmEmail}
                                        onChange={(e) => setConfirmEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="d-grid mb-3">
                                    <button type="submit" className="btn btn-primary">
                                        Save Email
                                    </button>
                                </div>
                            </form>
                        )}
                        {emailMessage && <div className="alert alert-success mt-3" role="alert">{emailMessage}</div>}
                        {emailError && <div className="alert alert-danger mt-3" role="alert">{emailError}</div>}

                        <button
                            className="btn btn-sm btn-link text-primary p-0 mb-3 text-decoration-none"
                            onClick={toggleChangePasswordForm}
                        >
                            Change password
                        </button>
                        {showChangePasswordForm && (
                            <form onSubmit={handlePasswordSubmit}>
                                <div className="mb-3 position-relative">
                                    <input
                                        type={showOldPassword ? "text" : "password"}
                                        className="form-control"
                                        id="oldPassword"
                                        placeholder="Old password"
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-sm p-0 position-absolute top-50 end-0 translate-middle-y me-2 text-secondary"
                                        onClick={() => setShowOldPassword(prev => !prev)}
                                        aria-label={showOldPassword ? "Hide password" : "Show Password"}
                                    >
                                        <i className={`bi ${showOldPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                                    </button>
                                </div>
                                <div className="mb-3 position-relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className="form-control"
                                        id="password"
                                        placeholder="New password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-sm p-0 position-absolute top-50 end-0 translate-middle-y me-2 text-secondary"
                                        onClick={() => setShowPassword(prev => !prev)}
                                        aria-label={showPassword ? "Hide password" : "Show Password"}
                                    >
                                        <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                                    </button>
                                </div>
                                <div className="mb-3 position-relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        className="form-control"
                                        id="confirmPassword"
                                        placeholder="Confirm new password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-sm p-0 position-absolute top-50 end-0 translate-middle-y me-2 text-secondary"
                                        onClick={() => setShowConfirmPassword(prev => !prev)}
                                        aria-label={showConfirmPassword ? "Hide password" : "Show Password"}
                                    >
                                        <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                                    </button>
                                </div>
                                <div className="d-grid">
                                    <button type="submit" className="btn btn-primary">Save password
                                    </button>
                                </div>
                            </form>
                        )}
                        {message && <div className="alert alert-success mt-3" role="alert">{message}</div>}
                        {error && <div className="alert alert-danger mt-3" role="alert">{error}</div>}


                    </div>

                    <div className="col text-start">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <h3>Rating: {currentUser.rating} pts</h3>
                            <Link to="/users/rating"
                                className='text-decoration-none'>
                                Rating calculation
                            </Link>
                        </div>
                        <h5 className='mt-3'>
                            <Link to='/profile/leaderboard'
                                className='text-decoration-none'
                            >
                                Leaderboard
                            </Link> position: {currentUser.ranking}
                        </h5>
                        <h5>
                            <Link
                                to='/statistics'
                                className='text-decoration-none'
                            >
                                Statistics
                            </Link>
                        </h5>
                        <p>Spots: {stats.spots}</p>
                        <p>Comments: {stats.comments}</p>
                        <p>Likes: {stats.likes}</p>
                        <p>Subscribers: {stats.subscribers}</p>
                        <p>Subscriptions: {stats.subscriptions}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
