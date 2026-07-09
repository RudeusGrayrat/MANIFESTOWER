import React from "react";
import { useNotificaciones } from "../../context/NotificacionesContext";

const NotificacionesWidget = () => {
    const { allNotificaciones, unreadcount } = useNotificaciones();

    // Mapeo de colores para tipos de notificación
    const getStatusColor = (type) => {
        switch (type) {
            case "APROBADO": return "bg-emerald-500";
            case "OBSERVADO": return "bg-orange-500";
            case "PENDIENTE": return "bg-slate-500";
            default: return "bg-blue-500";
        }
    };

    return (
        <div className="bg-white rounded-xl h-full border border-slate-200 shadow-sm flex flex-col ">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Notificaciones</h3>
                {unreadcount > 0 && (
                    <span className="bg-rose-100 text-rose-600 text-[10px] px-2 py-0.5 rounded-full font-bold">
                        {unreadcount} nuevas
                    </span>
                )}
            </div>

            {/* Lista */}
            <div className=" overflow-y-auto">
                {allNotificaciones.length > 0 ? (
                    allNotificaciones.slice(0, 10).map((notif) => (
                        <div key={notif.id} className="px-6 py-3 border-b border-slate-50 hover:bg-slate-50 transition-all flex items-start gap-3">
                            {/* Punto de estado */}
                            <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${!notif.read ? getStatusColor(notif.tipo) : "bg-slate-200"}`} />

                            <div className=" min-w-0">
                                <h4 className="text-sm font-bold text-slate-800 truncate">{notif.title}</h4>
                                <span className="text-[10px] text-slate-400 font-medium block mt-1.5">{notif.time}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                        Sin notificaciones recientes
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-slate-100 bg-slate-50/50 text-center">
                <button className="text-[11px] font-bold text-blue-600 hover:text-blue-800 uppercase">
                    Ver todas las notificaciones →
                </button>
            </div>
        </div>
    );
};

export default NotificacionesWidget;