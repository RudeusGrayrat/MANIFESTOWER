// Componente: LoadingOverlay.jsx
import React from "react";

const LoadingOverlay = ({ message = "Procesando solicitud..." }) => {
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex flex-col justify-center items-center transition-all duration-300">
            {/* Aro Girando (Spinner) */}
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

            {/* Texto de carga opcional */}
            {message && (
                <p className="text-white mt-4 text-lg font-semibold tracking-wide animate-pulse">
                    {message}
                </p>
            )}
        </div>
    );
};

export default LoadingOverlay;