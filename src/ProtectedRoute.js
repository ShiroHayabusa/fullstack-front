import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useAuth();

  if (!user) {
    // Если пользователь не авторизован, перенаправляем на страницу логина
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.some((role) => user.roles.includes(role))) {
    // Если у пользователя нет требуемой роли, перенаправляем на страницу без доступа
    return <Navigate to="/unauthorized" replace />;
  }
  return children; // Возвращаем дочерние компоненты, если доступ разрешён
};

export default ProtectedRoute;
