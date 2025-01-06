import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ActivateAccount = () => {
  const { token } = useParams(); // Получаем токен из URL
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const activateAccount = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/auth/activate-account/${token}`, {
          method: "GET",
        });

        console.log("Response status:", response.status);

        if (response.ok) {
          const successData = await response.json();
          console.log("Activation successful:", successData);
          setMessage("Your account has been successfully activated. You can now log in.");
          setError(""); // Сбрасываем сообщение об ошибке
          setTimeout(() => navigate("/login"), 5000); // Перенаправляем на страницу логина через 6 секунд
        } else {
          const errorData = await response.json();
          console.log("Activation failed:", errorData);
          setMessage(""); // Сбрасываем сообщение об успехе
          setError(errorData.message || "Failed to activate account.");
        }
      } catch (err) {
        console.error("Error during activation:", err);
        setMessage(""); // Сбрасываем сообщение об успехе
        setError("An error occurred. Please try again later.");
      }
    };

    if (token) {
      activateAccount();
    } else {
      setMessage(""); // Сбрасываем сообщение об успехе
      setError("Activation token is missing.");
    }
  }, [token, navigate]);

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="text-center mb-4">Activate Account</h2>
        {message && <div className="alert alert-success text-center">{message}</div>}
        {error && <div className="alert alert-danger text-center">{error}</div>}
      </div>
    </div>
  );
};

export default ActivateAccount;
