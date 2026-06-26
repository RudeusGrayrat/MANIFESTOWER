import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../notificaciones/ToastContext";
import axios from "../api/axios";
import socket from "../auth/socketIo";

const NotificacionesContext = createContext();

export const NotificacionesProvider = ({ children }) => {
    const [allNotificaciones, setAllNotificaciones] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, hasNextPage: false });
    const [loading, setLoading] = useState(false);

    const { user, activeRole } = useAuth();
    const { showInfo, showError } = useToast();

    // 🌟 GET NOTIFICACIONES: Corregido para leer exactamente lo que envía tu Backend
    const getNotificaciones = useCallback(async (page = 1, limit = 10, search = "", date = "") => {
        if (!user?._id) return;
        setLoading(true);
        try {
            // Petición limpia usando parámetros tradicionales de Axios
            const response = await axios.get("/herramientas/getNotificaciones", {
                params: {
                    _id: user._id,
                    typeUser: "UserExternal",
                    page,
                    limit,
                    search,
                    date
                }
            });

            // 🔥 CORRECCIÓN CLAVE: Desestructuramos las variables reales del backend
            const { notificaciones = [], totalUnread = 0, pagination: backendPagination } = response.data || {};

            // Mantenemos acumulación si la página es mayor a 1 (Scroll infinito / Cargar más)
            setAllNotificaciones(prev => page === 1 ? notificaciones : [...prev, ...notificaciones]);
            setUnreadCount(totalUnread);

            const totalItems = backendPagination?.totalItems || 0;
            setPagination({
                page,
                limit,
                total: totalItems,
                hasNextPage: backendPagination?.hasNextPage ?? (page * limit < totalItems),
            });
        } catch (error) {
            console.error("Error al cargar notificaciones:", error);
            if (showError) showError("No se pudieron cargar las notificaciones.");
        } finally {
            setLoading(false);
        }
    }, [user?._id, showError]);

    // Carga inicial automática al iniciar sesión
    useEffect(() => {
        if (user?._id) {
            getNotificaciones(1, 10);
        }
    }, [user?._id, getNotificaciones]);


    // 🔌 CONTROL DE SALAS SOCKET (Tiempo Real) - ¡CORREGIDO!
    useEffect(() => {
        if (!user?._id) return;

        const registrarEnSalas = () => {
            // 1. 🟢 Eliminamos el .toUpperCase(). Mantenemos el casing original del backend
            const misRoles = Array.isArray(user.roles)
                ? user.roles
                : activeRole ? [activeRole] : [];

            // 2. 🟢 Cambiamos "userType" por "typeUser" para alinearlo con tu endpoint de Axios
            socket.emit("register_session", {
                userId: user._id,
                userType: "UserExternal",
                roles: misRoles,
            });
            console.log(`🔌 Registrado en Sockets de ManifesTower (UserExternal) con roles:`, misRoles);
        };

        // 3. 🟢 Si por alguna razón el socket está apagado, forzamos el encendido
        if (!socket.connected) {
            socket.connect();
        }

        socket.on("connect", registrarEnSalas);
        if (socket.connected) registrarEnSalas();

        return () => {
            socket.off("connect", registrarEnSalas);
        };
    }, [user?._id, activeRole]);
    // 🔔 ESCUCHA DE NUEVAS NOTIFICACIONES EN TIEMPO REAL
    useEffect(() => {
        if (!user?._id) return;

        const handleIncomingNotification = (data) => {
            console.log("🔥 FRONT: ¡Llegó una notificación por WebSockets!", data);
            setAllNotificaciones((prev) => [data, ...prev]);
            setUnreadCount((prev) => prev + 1);

            if (showInfo) {
                showInfo(`${data.title || "Notificación"}: ${data.message}`);
            }
            console.log("🎧 FRONT: Montando listener de sockets...");
            if (Notification.permission === "granted") {
                new Notification(data.title, { body: data.message });
            }
        };

        // 🌟 AQUÍ: Asegúrate de que escuche el mismo evento que el backend
        socket.on("nuevaNotificacion", handleIncomingNotification);

        if (Notification.permission !== "denied" && Notification.permission !== "granted") {
            Notification.requestPermission();
        }

        return () => {
            console.log("🔇 FRONT: Desmontando listener de sockets")
            socket.off("nuevaNotificacion", handleIncomingNotification);
        };
    }, [user?._id, showInfo]);

    // 📝 MARCAR COMO LEÍDA: Corregido con persistencia en DB y mutación adaptada al modelo
    const marcarComoLeida = useCallback(async (id) => {
        if (!user?._id) return;
        try {
            // 1. Persistencia real en el Backend
            await axios.patch(`/herramientas/notificacionLeida/${id}`, { userId: user._id });

            // 2. Mutación optimista respetando el esquema de base de datos (INDIVIDUAL vs GLOBAL/SUBMODULE)
            setAllNotificaciones(prev =>
                prev.map(n => {
                    if (n._id !== id) return n;

                    if (n.type === "INDIVIDUAL") {
                        return { ...n, isReadIndividual: true };
                    } else {
                        const yaExiste = n.readBy?.some(r => (r.userId?._id || r.userId) === user._id);
                        if (yaExiste) return n;
                        return {
                            ...n,
                            readBy: [...(n.readBy || []), { userId: user._id }]
                        };
                    }
                })
            );

            // 3. Descontar del contador global
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error("Error al marcar la notificación como leída:", error);
            if (showError) showError("No se pudo actualizar el estado de la notificación.");
        }
    }, [user?._id, showError]);

    return (
        <NotificacionesContext.Provider value={{
            allNotificaciones,
            unreadCount,
            pagination,
            loading,
            getNotificaciones,
            marcarComoLeida,
            setUnreadCount
        }}>
            {children}
        </NotificacionesContext.Provider>
    );
};

export const useNotificaciones = () => {
    const context = useContext(NotificacionesContext);
    if (!context) throw new Error("useNotificaciones debe ser usado dentro de NotificacionesProvider");
    return context;
};