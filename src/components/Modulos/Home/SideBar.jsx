import { useState } from "react";
import { Link } from "react-router-dom";
import { useNotificaciones } from "../../context/NotificacionesContext";

const ICONS = {
    empresa: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h18v18H3V3z" />
        </svg>
    ),
    logout: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M19 12H9m10 0l-3-3m3 3l-3 3" />
        </svg>
    )
};

const SideBar = ({ user, activeRole, mobileOpen, setMobileOpen }) => {
    const [isHovered, setIsHovered] = useState(false);
    const ruc = user?.ruc || "00000000000";
    const { unreadCount } = useNotificaciones();

    const getAvailableModules = () => {
        if (activeRole === "GENERADOR") {
            return [
                { module: "MANIFIESTOS", path: "/manifiestos" },
                { module: "TRANSPORTISTAS", path: "/transportistas" }
            ];
        } else if (activeRole === "TRANSPORTISTA") {
            return [
                { module: "MANIFIESTOS", path: "/manifiestos" },
                { module: "GENERADORES", path: "/generadores" }
            ];
        }
        return [];
    };

    const userOptions = getAvailableModules();

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("token_expiry");
        window.location.href = "/login";
    };

    return (
        <>
            {/* Overlay oscuro detrás del drawer (mobile) */}
            {mobileOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/40 z-[65]"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Drawer deslizante mobile */}
            <div
                className={`md:hidden fixed top-0 left-0 h-full w-72 max-w-[80vw] z-[70] bg-gradient-to-b from-[#8fe29a] to-[#0e5836] shadow-2xl flex flex-col transition-transform duration-300 
                    ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                <div className="flex items-center justify-between px-5 pt-6 pb-4">
                    <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-3">
                        <img src="/TOWER_ICON.svg" width={48} height={48} alt="LOGO TOWER" />
                        <span className="font-black text-white tracking-wider text-sm">MANIFESTOWER</span>
                    </Link>
                    <button onClick={() => setMobileOpen(false)} className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 text-white" aria-label="Cerrar menú">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="w-full flex flex-col items-center space-y-4 flex-1 overflow-y-auto px-4" style={{ scrollbarWidth: "none" }}>
                    {userOptions.map((options, index) => (
                        <Link
                            key={index}
                            to={options.path}
                            onClick={() => setMobileOpen(false)}
                            className="h-14 w-[85%] flex items-center border border-gray-200 shadow-md shadow-emerald-950/20 bg-gradient-to-tr from-white to-gray-100 rounded-full cursor-pointer active:shadow-inner transition-all duration-300 ease-in-out group overflow-hidden no-underline"
                        >
                            <div className="w-14 h-full flex items-center justify-center shrink-0">
                                <img src={`/${options.module}.svg`} alt="icon" width={32} height={32} />
                            </div>
                            <span className="font-bold text-sm text-emerald-900 tracking-wide whitespace-nowrap ml-2">
                                {options.module}
                            </span>
                        </Link>
                    ))}
                </div>

                <div className="w-full flex flex-col items-center space-y-3 pb-6 shrink-0 border-t border-emerald-400/20 pt-4 px-4">
                    <Link to="/perfil" onClick={() => setMobileOpen(false)} className="h-14 w-[85%] flex items-center border border-emerald-300/30 bg-white/10 text-white rounded-full overflow-hidden">
                        <div className="w-14 h-full flex items-center justify-center shrink-0">{ICONS.empresa}</div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-xs font-bold tracking-wide truncate pr-1">{activeRole}</span>
                            <span className="text-[10px] text-emerald-200 font-medium tracking-wider">{ruc}</span>
                        </div>
                    </Link>

                    <Link to="/notificaciones" onClick={() => setMobileOpen(false)} className="h-12 w-[85%] flex items-center bg-emerald-900/20 hover:bg-white/10 text-emerald-100 rounded-full cursor-pointer overflow-hidden no-underline">
                        <div className="w-14 h-full flex items-center justify-center shrink-0 relative">
                            {unreadCount > 0 && (
                                <div className="absolute -right-0.5 top-1 flex justify-center items-center w-5 h-5 bg-red-400 rounded-full text-white text-[10px] font-bold">
                                    {unreadCount}
                                </div>
                            )}
                            <span className="pi pi-bell text-[22px]!"></span>
                        </div>
                        <span className="font-medium text-sm tracking-wide">Notificaciones</span>
                    </Link>

                    <Link to="/configuracion" onClick={() => setMobileOpen(false)} className="h-12 w-[85%] flex items-center bg-emerald-900/20 hover:bg-white/10 text-emerald-100 rounded-full cursor-pointer overflow-hidden no-underline">
                        <div className="w-14 h-full flex items-center justify-center shrink-0">
                            <span className="pi pi-cog !text-[22px]"></span>
                        </div>
                        <span className="font-medium text-sm tracking-wide">Configuración</span>
                    </Link>

                    <button onClick={logout} className="h-14 w-[85%] flex items-center bg-red-950/20 hover:bg-red-500/20 text-red-100 rounded-full cursor-pointer overflow-hidden border border-transparent hover:border-red-400/30">
                        <div className="w-14 h-full flex items-center justify-center shrink-0">{ICONS.logout}</div>
                        <span className="font-bold text-sm tracking-wide">Cerrar Sesión</span>
                    </button>
                </div>
            </div>

            {/* ===== DESKTOP/TABLET: sidebar hover original (solo md+) ===== */}
            <div
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`hidden md:flex left-0 top-0 z-50 flex-col items-center min-h-screen bg-gradient-to-b from-[#8fe29a] to-[#0e5836] shadow-gray-300 transition-all duration-300 ease-in-out
                    ${isHovered ? 'w-64 shadow-[6px_0_20px_rgba(14,88,54,0.3)]' : 'w-20 shadow-[4px_0_8px_rgba(128,128,128,0.15)]'}
                `}
            >
                <Link to="/" className={`w-full flex items-center h-18 my-10 transition-all duration-300 ease-in-out ${isHovered ? 'pl-6 justify-start' : 'justify-center'}`}>
                    <div className="shrink-0">
                        <img src="/TOWER_ICON.svg" width={66} height={66} alt="LOGO TOWER" className="transition-transform duration-300 hover:scale-105" />
                    </div>
                    <span className={`font-black text-white tracking-wider text-sm transition-all duration-300 ${isHovered ? 'ml-3 opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none hidden'}`}>
                        MANIFESTOWER
                    </span>
                </Link>

                <div className="w-full flex flex-col items-center space-y-4" style={{ scrollBehavior: "smooth", overflowY: "auto", height: "55vh", scrollbarWidth: "none" }}>
                    {userOptions.map((options, index) => (
                        <Link key={index} to={options.path}
                            className={`h-14 flex items-center border border-gray-200 shadow-md shadow-emerald-950/20 bg-gradient-to-tr from-white to-gray-100 rounded-full cursor-pointer active:shadow-inner transition-all duration-300 ease-in-out group overflow-hidden no-underline ${isHovered ? 'w-[85%]' : 'w-14'}`}
                            title={options.module}>
                            <div className="w-14 h-full flex items-center justify-center shrink-0">
                                <img src={`/${options.module}.svg`} alt="icon" width={32} height={32} className="transition-transform duration-300 group-hover:scale-110" />
                            </div>
                            <span className={`font-bold text-sm text-emerald-900 tracking-wide whitespace-nowrap transition-all duration-300 ease-in-out overflow-hidden ${isHovered ? 'opacity-100 translate-x-0 w-auto ml-2' : 'opacity-0 -translate-x-10 w-0 ml-0 pointer-events-none'}`}>
                                {options.module}
                            </span>
                        </Link>
                    ))}
                </div>

                <div className="mt-auto w-full flex flex-col items-center space-y-3 pb-6 shrink-0 border-t border-emerald-400/20 pt-4">
                    <Link to="/perfil" className={`h-14 flex items-center border border-emerald-300/30 bg-white/10 text-white rounded-full transition-all duration-300 ease-in-out overflow-hidden ${isHovered ? 'w-[85%]' : 'w-14'}`} title={`${activeRole} - ${ruc}`}>
                        <div className="w-14 h-full flex items-center justify-center shrink-0">{ICONS.empresa}</div>
                        <div className={`flex flex-col min-w-0 transition-all duration-300 ease-in-out overflow-hidden ${isHovered ? 'opacity-100 translate-x-0 w-auto' : 'opacity-0 -translate-x-10 w-0 pointer-events-none'}`}>
                            <span className="text-xs font-bold tracking-wide truncate pr-1">{activeRole}</span>
                            <span className="text-[10px] text-emerald-200 font-medium tracking-wider">{ruc}</span>
                        </div>
                    </Link>
                    <Link to="/notificaciones" className={`h-12 flex items-center bg-emerald-900/20 hover:bg-white/10 text-emerald-100 rounded-full cursor-pointer transition-all duration-300 ease-in-out group overflow-hidden no-underline ${isHovered ? 'w-[85%]' : 'w-14'}`} title="Notificaciones">
                        <div className="w-14 h-full flex items-center justify-center shrink-0">
                            <div className="transition-transform duration-300 h-full flex items-center group-hover:translate-x-0.5 relative">
                                {unreadCount > 0 && (
                                    <div className="absolute -right-1.5 top-0.5 flex justify-center items-center w-5 h-5 bg-red-400 rounded-full text-white text-[10px] font-bold">{unreadCount}</div>
                                )}
                                <span className="pi pi-bell text-[24px]!"></span>
                            </div>
                        </div>
                        <span className={`font-medium text-sm tracking-wide whitespace-nowrap transition-all duration-300 ease-in-out overflow-hidden ${isHovered ? 'opacity-100 translate-x-0 w-auto' : 'opacity-0 -translate-x-10 w-0 pointer-events-none'}`}>
                            Notificaciones
                        </span>
                    </Link>
                    <Link to="/configuracion" className={`h-12 flex items-center bg-emerald-900/20 hover:bg-white/10 text-emerald-100 rounded-full cursor-pointer transition-all duration-300 ease-in-out group overflow-hidden no-underline ${isHovered ? 'w-[85%]' : 'w-14'}`} title="Configuración">
                        <div className="w-14 h-full flex items-center justify-center shrink-0">
                            <div className="transition-transform duration-300 h-full flex items-center group-hover:translate-x-0.5">
                                <span className="pi pi-cog !text-[24px]"></span>
                            </div>
                        </div>
                        <span className={`font-medium text-sm tracking-wide whitespace-nowrap transition-all duration-300 ease-in-out overflow-hidden ${isHovered ? 'opacity-100 translate-x-0 w-auto' : 'opacity-0 -translate-x-10 w-0 pointer-events-none'}`}>
                            Configuración
                        </span>
                    </Link>
                    <button onClick={logout} className={`h-14 flex items-center bg-red-950/20 hover:bg-red-500/20 text-red-100 rounded-full cursor-pointer active:shadow-inner transition-all duration-300 ease-in-out group overflow-hidden border border-transparent hover:border-red-400/30 ${isHovered ? 'w-[85%]' : 'w-14'}`} title="Cerrar Sesión">
                        <div className="w-14 h-full flex items-center justify-center shrink-0">
                            <div className="transition-transform duration-300 group-hover:translate-x-0.5">{ICONS.logout}</div>
                        </div>
                        <span className={`font-bold text-sm tracking-wide whitespace-nowrap transition-all duration-300 ease-in-out overflow-hidden ${isHovered ? 'opacity-100 translate-x-0 w-auto' : 'opacity-0 -translate-x-10 w-0 pointer-events-none'}`}>
                            Cerrar Sesión
                        </span>
                    </button>
                </div>
            </div>
        </>
    );
};

export default SideBar;