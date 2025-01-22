import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

const VerifyEmail = () => {
    const { email, token } = useParams();
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/profile/verify-changed-email/${email}+${token}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                        'Content-Type': 'application/json', 
                    },
                });

                console.log("Response status:", response.status);

                if (response.ok) {
                    const message = await response.text();
                    setMessage(message);
                    setError(""); 
                    setTimeout(() => navigate("/user/profile"), 3000); 
                } else {
                    const errorData = await response.json();
                    console.log("Verification failed:", errorData);
                    setMessage(""); 
                    setError(errorData.message || "Failed to verify email.");
                }
            } catch (err) {
                console.error("Error during verification:", err);
                setMessage(""); 
                setError("An error occurred. Please try again later.");
            }
        };

        if (token) {
            verifyEmail();
        } else {
            setMessage(""); 
            setError("Verification token is missing.");
        }
    }, [token, navigate]);

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 shadow" style={{ maxWidth: "400px", width: "100%" }}>
                <h2 className="text-center mb-4">Verify email</h2>
                {message && <div className="alert alert-success text-center">{message}</div>}
                {error && <div className="alert alert-danger text-center">{error}</div>}
            </div>
        </div>
    );
};

export default VerifyEmail;
