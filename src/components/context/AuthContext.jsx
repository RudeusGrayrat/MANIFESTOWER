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
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const signin = async (userData) => {
        try {
            const response = await axios.post("/login", userData);
            const data = response.data;
            if (data.token) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("token_expiry", Date.now() + 24 * 60 * 60 * 1000);
                setUser(data.data);
                setIsAuthenticated(true);
                return { success: true };
            } else {
                throw new Error("Token no recibido");
            }
        } catch (error) {
            // El error se maneja y se retorna al componente que llamó al login
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
    };

    useEffect(() => {
        async function checkLogin() {
            const token = localStorage.getItem("token");
            const expiry = localStorage.getItem("token_expiry");

            if (expiry && Date.now() > Number(expiry)) {
                logout();
                setIsLoading(false);
                return;
            }

            if (token) {
                try {
                    const response = await verifyToken(token);
                    if (response?.response?.data?.message === "No se encuentra este usuario") {
                        logout();
                    } else if (response?.data) {
                        setUser(response.data);
                        setIsAuthenticated(true);
                    } else {
                        setIsAuthenticated(false);
                    }
                } catch (error) {
                    logout();
                }
            }
            setIsLoading(false);
        }
        checkLogin();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                signin,
                isAuthenticated,
                isLoading,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};