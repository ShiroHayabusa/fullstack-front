// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
// если вы используете jwtDecode для расшифровки токена:
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

// Утилита для получения пользователя из localStorage
// (например, вытаскиваем токен, пробуем декодировать)
function getUserFromLocalStorage() {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
        const decoded = jwtDecode(token);
        const roles = decoded.roles || []; // Предполагается, что `roles` хранится в токене
        return { token, username: decoded.sub, roles };
    } catch (error) {
        console.error("Invalid token in localStorage", error);
        return null;
    }
}

// Хук, чтобы «вытянуть» контекст в любом компоненте
export function useAuth() {
    return useContext(AuthContext);
}

// Сам провайдер
export function AuthProvider({ children }) {
    // Изначально пробуем взять пользователя из localStorage
    const [user, setUser] = useState(() => getUserFromLocalStorage());

    // Метод логина — сохраняет token в localStorage и обновляет state
    const login = (token) => {
        localStorage.setItem("token", token);
        try {
            const decoded = jwtDecode(token);
            const roles = decoded.roles || []; // Извлекаем роли
            setUser({ token, username: decoded.sub, roles });
        } catch (err) {
            console.error("Login failed, invalid token", err);
            setUser(null);
        }
    };

    // Метод логаута — удаляет token и обнуляет state
    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    // Можно делать эффекты, например, следить за user или token’ом
    useEffect(() => {
        // Если user вдруг становится null (логаут), или при старте — можно делать доп. действия
    }, [user]);

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
