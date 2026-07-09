import React from "react";
import { useNotificaciones } from "../../context/NotificacionesContext";
import { useNavigate } from "react-router-dom";

const NotificacionesWidget = () => {
    const { allNotificaciones, unreadcount } = useNotificaciones();
    const navigate = useNavigate();

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col h-full min-h-0 overflow-hidden">

            {/* Header */}
            <div className="px-[clamp(0.75rem,1vw,1.25rem)] py-[clamp(0.625rem,0.8vw,1rem)] border-b border-gray-50 flex-none flex justify-between items-center">
                <h3 className="font-bold text-gray-800 text-[clamp(0.65rem,0.3vw+0.55rem,0.8125rem)] uppercase tracking-wider">
                    Actividad
                </h3>
                {unreadcount > 0 && (
                    <span className="bg-rose-50 text-rose-600 text-[clamp(0.5625rem,0.2vw+0.5rem,0.6875rem)] px-2 py-0.5 rounded-full font-bold">
                        {unreadcount} nuevas
                    </span>
                )}
            </div>

            {/* Lista */}
            <div className="flex-1 min-h-0 overflow-y-auto">
                {allNotificaciones.length > 0 ? allNotificaciones.map((notif) => (
                    <div
                        key={notif._id}
                        className="px-[clamp(0.75rem,1vw,1.25rem)] py-[clamp(0.5rem,0.8vw,0.875rem)] border-b border-gray-50 flex items-start gap-[clamp(0.5rem,0.6vw,0.75rem)] hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                        {/* Punto de no-leído */}
                        <div className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${!notif.read ? "bg-blue-500" : "bg-gray-200"}`} />

                        <div className="min-w-0 flex-1">
                            {/* Fila superior: título + módulo (módulo solo en pantallas grandes) */}
                            <div className="flex items-center gap-2 flex-wrap">
                                <p className={`text-[clamp(0.6875rem,0.35vw+0.55rem,0.875rem)] leading-snug ${!notif.read ? "font-semibold text-gray-800" : "font-medium text-gray-500"}`}>
                                    {notif.title}
                                </p>
                                {notif.submodule?.name && (
                                    <span className="hidden xl:inline-block text-[clamp(0.5rem,0.15vw+0.45rem,0.625rem)] font-bold uppercase tracking-wide text-[#285598] bg-blue-50 px-1.5 py-0.5 rounded-md shrink-0">
                                        {notif.submodule.name}
                                    </span>
                                )}
                            </div>

                            {/* Descripción: solo visible en monitores grandes (2xl+) */}
                            {notif.message && (
                                <p className="hidden 2xl:block text-[clamp(0.6875rem,0.3vw+0.55rem,0.8125rem)] text-gray-500 leading-snug mt-1 line-clamp-2">
                                    {notif.message}
                                </p>
                            )}

                            <span className="block text-[clamp(0.5625rem,0.2vw+0.5rem,0.6875rem)] text-gray-400 mt-1">
                                {notif.time}
                            </span>
                        </div>

                        {!notif.read && (
                            <div className="hidden lg:block w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                        )}
                    </div>
                )) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6 gap-2">
                        <i className="pi pi-inbox text-2xl text-gray-300"></i>
                        <span className="text-gray-400 text-xs">Sin notificaciones</span>
                    </div>
                )}
            </div>

            {/* Botón footer */}
            <button
                onClick={() => navigate('/notificaciones')}
                className="flex-none p-[clamp(0.625rem,0.8vw,0.875rem)] w-full text-[clamp(0.6875rem,0.25vw+0.6rem,0.75rem)] font-bold text-[#285598] border-t border-gray-50 hover:bg-blue-50 transition-colors"
            >
                VER MÁS NOTIFICACIONES
            </button>
        </div>
    );
};
export default NotificacionesWidget;