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
                const response = await fetch(`http://localhost:8080/users/profile/verify-changed-email/${email}+${token}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                        'Content-Type': 'application/json', // Optional but recommended
                    },
                });

                console.log("Response status:", response.status);

                if (response.ok) {
                    const message = await response.text();
                    setMessage(message);
                    setError(""); // Сбрасываем сообщение об ошибке
                    setTimeout(() => navigate("/user/profile"), 3000); // Перенаправляем на страницу логина через 6 секунд
                } else {
                    const errorData = await response.json();
                    console.log("Verification failed:", errorData);
                    setMessage(""); // Сбрасываем сообщение об успехе
                    setError(errorData.message || "Failed to verify email.");
                }
            } catch (err) {
                console.error("Error during verification:", err);
                setMessage(""); // Сбрасываем сообщение об успехе
                setError("An error occurred. Please try again later.");
            }
        };

        if (token) {
            verifyEmail();
        } else {
            setMessage(""); // Сбрасываем сообщение об успехе
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
