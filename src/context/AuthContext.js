import React, { createContext, useContext, useState, useEffect } from "react";
// if use jwtDecode to decrypt the token:
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

// Utility for getting user from localStorage
// (for example, we extract token, try to decode)
function getUserFromLocalStorage() {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
        const decoded = jwtDecode(token);
        const roles = decoded.roles || []; // Assumes `roles` is stored in the token
        return { token, username: decoded.sub, roles };
    } catch (error) {
        console.error("Invalid token in localStorage", error);
        return null;
    }
}

// Hook to "pull" context in any component
export function useAuth() {
    return useContext(AuthContext);
}

// The provider itself
export function AuthProvider({ children }) {
    // Initially we try to take the user from localStorage
    const [user, setUser] = useState(() => getUserFromLocalStorage());

    // Login method - saves token to localStorage and updates state
    const login = (token) => {
        localStorage.setItem("token", token);
        try {
            const decoded = jwtDecode(token);
            const roles = decoded.roles || []; // Extract roles
            setUser({ token, username: decoded.sub, roles });
        } catch (err) {
            console.error("Login failed, invalid token", err);
            setUser(null);
        }
    };

    // Logout method - removes token and resets state
    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    // can make effects, for example, follow the user or token
    useEffect(() => {
        // If user suddenly becomes null (logout), or at startup - can do additional actions
    }, [user]);

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
