import React, { createContext, useContext, useRef } from "react";
import { Toast } from "primereact/toast";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const toastRef = useRef(null);

    // Funciones wrappers personalizadas y seguras
    const showSuccess = (detail, summary = "Éxito") => {
        toastRef.current?.show({ severity: "success", summary, detail: detail?.message || detail, life: 5000 });
    };

    const showError = (detail, summary = "Error") => {
        toastRef.current?.show({ severity: "error", summary, detail: detail?.message || detail, life: 5000 });
    };

    const showWarning = (detail, summary = "Advertencia") => {
        toastRef.current?.show({ severity: "warn", summary, detail: detail?.message || detail, life: 5000 });
    };

    const showInfo = (detail, summary = "Información") => {
        toastRef.current?.show({ severity: "info", summary, detail: detail?.message || detail, life: 5000 });
    };

    return (
        <ToastContext.Provider value={{ showSuccess, showError, showWarning, showInfo }}>
            {/* El componente nativo se renderiza una sola vez en el top de la app */}
            <Toast ref={toastRef} position="top-right" />
            {children}
        </ToastContext.Provider>
    );
};

// Hook personalizado para usarlo en cualquier parte de la app
export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast debe ser utilizado dentro de un ToastProvider");
    }
    return context;
};