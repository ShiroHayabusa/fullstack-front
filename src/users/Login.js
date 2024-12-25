import React from 'react';

const Login = () => {
  const handleLogin = (provider) => {
    // Перенаправление напрямую на маршрут авторизации
    window.location.href = `http://localhost:8080/oauth2/authorization/${provider}`;
  };

  return (
    <div>
      <h1>Login</h1>
      <button onClick={() => handleLogin('google')}>Login with Google</button>
      <button onClick={() => handleLogin('facebook')}>Login with Facebook</button>
    </div>
  );
};

export default Login;
