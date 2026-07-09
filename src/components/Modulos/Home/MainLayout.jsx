import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import Sidebar from "./SideBar";
import { useAuth } from "../../context/AuthContext";
import { useNotificaciones } from "../../context/NotificacionesContext";

const MainLayout = () => {
    const { user, activeRole } = useAuth();
    const { unreadCount } = useNotificaciones();
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-[#ffffff]">
            {/* Sidebar: ahora recibe el estado del drawer desde aquí */}
            <Sidebar
                user={user}
                activeRole={activeRole}
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
            />

            <div className="flex flex-1 flex-col overflow-hidden">

                {/* Barra superior SOLO mobile/tablet: en el flujo normal, reserva su espacio, nunca tapa contenido */}
                <header className="md:hidden flex-none h-14 flex items-center justify-between px-4 border-b border-gray-100 bg-white z-40">
                    <button
                        onClick={() => setMobileOpen(true)}
                        className="w-9 h-9 -ml-1.5 flex items-center justify-center rounded-lg active:bg-gray-100 transition-colors"
                        aria-label="Abrir menú"
                    >
                        <div className="flex flex-col gap-[3px]">
                            <span className="block w-5 h-0.5 bg-gray-700 rounded-full" />
                            <span className="block w-5 h-0.5 bg-gray-700 rounded-full" />
                            <span className="block w-5 h-0.5 bg-gray-700 rounded-full" />
                        </div>
                    </button>

                    <Link to="/" className="flex items-center gap-2">
                        <img src="/TOWER_ICON.svg" width={28} height={28} alt="logo" />
                        <span className="font-black text-[#285598] text-sm tracking-wide">MANIFESTOWER</span>
                    </Link>

                    <Link to="/notificaciones" className="relative w-9 h-9 flex items-center justify-center rounded-lg active:bg-gray-100 transition-colors">
                        <i className="pi pi-bell text-lg text-gray-600"></i>
                        {unreadCount > 0 && (
                            <span className="absolute top-1 right-1 bg-rose-500 text-white text-[9px] min-w-[16px] h-4 px-0.5 flex items-center justify-center rounded-full font-bold leading-none">
                                {unreadCount}
                            </span>
                        )}
                    </Link>
                </header>

                <main className="flex-1 overflow-y-auto p-4 md:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;