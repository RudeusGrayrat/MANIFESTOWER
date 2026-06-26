import axios from "../api/axios";
import { createContext, useContext, useEffect, useState } from "react";
import { verifyToken } from "../api/verifyToken";

export const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [activeRole, setActiveRole] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const signin = async (userData) => {
        try {
            const response = await axios.post("/manifesTower/login", userData);
            const data = response.data;
            console.log("Respuesta del servidor en signin:", data);
            if (data.token) {
                console.log("Token recibido:", data.token);
                localStorage.setItem("token", data.token);
                localStorage.setItem("token_expiry", Date.now() + 24 * 60 * 60 * 1000);
                setUser(data.user);
                setActiveRole(data.user.rolActivo); // Establecer el primer rol como activo
                setIsAuthenticated(true);
                return { success: true };
            } else {
                throw new Error("Token no recibido");
            }
        } catch (error) {
            return {
                success: false,
                message: error?.response?.data?.message || "Error al iniciar sesión"
            };
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("token_expiry");
        setUser(null);
        setIsAuthenticated(false);
        console.log("Usuario ha cerrado sesión. Token eliminado del localStorage.");
    };

    useEffect(() => {
        async function checkLogin() {
            const token = localStorage.getItem("token");
            const expiry = localStorage.getItem("token_expiry");

            // 1. Validar expiración local por tiempo simulado
            if (expiry && Date.now() > Number(expiry)) {
                logout();
                setIsLoading(false);
                return;
            }

            // 2. Si hay token, ir al backend a verificarlo de verdad
            if (token) {
                try {
                    const { user, activeRole } = await verifyToken(token);
                    setUser(user);
                    setActiveRole(activeRole);
                    setIsAuthenticated(true);
                } catch (error) {
                    logout();
                }
            } else {
                setIsAuthenticated(false);
            }

            // Deshabilitar el estado de carga al terminar cualquier flujo
            setIsLoading(false);
        }
        checkLogin();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                activeRole,
                signin,
                isAuthenticated,
                isLoading, // Asegúrate de usar 'isLoading' en tu App.jsx o ProtectedRoute
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};