import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useAuth();

  if (!user) {

    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.some((role) => user.roles.includes(role))) {

    return <Navigate to="/unauthorized" replace />;
  }
  return children; 
};

export default ProtectedRoute;
