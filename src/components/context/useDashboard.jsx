import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "../api/axios";

export const useDashboard = () => {
    const { user, activeRole } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user?._id) return;
        const fetchStats = async () => {
            try {
                setLoading(true);
                const response = await axios.get("/manifesTower/dashboardStats", {
                    params: { usuarioId: user._id, rolActivo: activeRole }
                });
                setData(response.data.data);
                setError(null);
            } catch (err) {
                setError(err.response?.data?.message || "Error al cargar el dashboard");
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [user, activeRole]);

    return { data, loading, error };
};