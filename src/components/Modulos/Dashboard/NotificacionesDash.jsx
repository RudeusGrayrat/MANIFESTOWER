// components/notificaciones/NotificacionesWidget.jsx
import React from "react";
import { useNotificaciones } from "../../context/NotificacionesContext";

const NotificacionesWidget = () => {
    const { allNotificaciones, unreadcount } = useNotificaciones();

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-800">Notificaciones</h3>
                {unreadcount > 0 && (
                    <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                        {unreadcount} Nuevas
                    </span>
                )}
            </div>
            <div className="max-h-[400px] overflow-y-auto">
                {allNotificaciones.length > 0 ? (
                    allNotificaciones.slice(0, 5).map((notif) => (
                        <div key={notif.id} className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors">
                            <h4 className="text-sm font-semibold text-slate-700">{notif.title}</h4>
                            <p className="text-xs text-slate-500 mt-1">{notif.message}</p>
                            <span className="text-[10px] text-slate-400 block mt-2">{notif.time}</span>
                        </div>
                    ))
                ) : (
                    <div className="p-8 text-center text-slate-400 text-sm">
                        Sin notificaciones recientes
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificacionesWidget;