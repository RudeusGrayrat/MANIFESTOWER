import { useState } from "react";
import { Link } from "react-router-dom";
import { useNotificaciones } from "../../context/NotificacionesContext";

const ICONS = {
    //logo de engranaje :
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

const SideBar = ({ user, activeRole }) => {
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
        return []; // Si no hay rol, no mostrar nada
    };

    const userOptions = getAvailableModules();

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("token_expiry");
        window.location.href = "/login";
    };

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={` left-0 top-0 z-50 flex flex-col items-center min-h-screen bg-gradient-to-b from-[#8fe29a] to-[#0e5836] shadow-gray-300 transition-all duration-300 ease-in-out
                ${isHovered ? 'w-64 shadow-[6px_0_20px_rgba(14,88,54,0.3)]' : 'w-20 shadow-[4px_0_8px_rgba(128,128,128,0.15)]'}
            `}
        >
            {/* LOGO SUPERIOR */}
            <Link to="/" className={`w-full flex items-center h-18 my-10 transition-all duration-300 ease-in-out ${isHovered ? 'pl-6 justify-start' : 'justify-center'}`}>
                <div className="shrink-0">
                    <img
                        src="/TOWER_ICON.svg"
                        width={66}
                        height={66}
                        alt="LOGO TOWER"
                        className="transition-transform duration-300 hover:scale-105"
                    />
                </div>
                <span className={`font-black text-white tracking-wider text-sm transition-all duration-300 ${isHovered ? 'ml-3 opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none hidden'}`}>
                    MANIFESTOWER
                </span>
            </Link>

            {/* CONTENEDOR DE OPCIONES */}
            <div
                className="w-full flex flex-col items-center space-y-4"
                style={{
                    scrollBehavior: "smooth",
                    overflowY: "auto",
                    height: "55vh", /* Reducido ligeramente para dar holgura al menú inferior dinámico */
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                }}
            >
                {userOptions.length > 0 && userOptions[0].module !== ""
                    ? userOptions.map((options, index) => (
                        <Link
                            key={index}
                            to={options.path}
                            className={`h-14 flex items-center border border-gray-200 shadow-md shadow-emerald-950/20 bg-gradient-to-tr from-white to-gray-100 rounded-full cursor-pointer active:shadow-inner transition-all duration-300 ease-in-out group overflow-hidden no-underline
                                ${isHovered ? 'w-[85%]' : 'w-14'}
                            `}
                            title={options.module}
                        >
                            <div className="w-14 h-full flex items-center justify-center shrink-0">
                                <img
                                    src={`/${options.module}.svg`}
                                    alt="icon"
                                    width={32}
                                    height={32}
                                    className="transition-transform duration-300 group-hover:scale-110"
                                />
                            </div>

                            {/* TITULO DEL MÓDULO */}
                            <span
                                className={`font-bold text-sm text-emerald-900 tracking-wide whitespace-nowrap transition-all duration-300 ease-in-out overflow-hidden
                                    ${isHovered
                                        ? 'opacity-100 translate-x-0 w-auto ml-2'
                                        : 'opacity-0 -translate-x-10 w-0 ml-0 pointer-events-none'
                                    }
                                `}
                            >
                                {options.module}
                            </span>
                        </Link>
                    ))
                    : null}
            </div>

            {/* CONTENEDOR INFERIOR (ADMINISTRACIÓN Y EMPRESA) */}
            <div className="mt-auto w-full flex flex-col items-center space-y-3 pb-6 shrink-0 border-t border-emerald-400/20 pt-4">

                {/* TARJETA DE RAZÓN SOCIAL / RUC */}
                <Link
                    to="/perfil"
                    className={`h-14 flex items-center border border-emerald-300/30 bg-white/10 text-white rounded-full transition-all duration-300 ease-in-out overflow-hidden
                        ${isHovered ? 'w-[85%]' : 'w-14'}
                    `}
                    title={`${activeRole} - ${ruc}`}
                >
                    {/* Caja fija de w-14 */}
                    <div className="w-14 h-full flex items-center justify-center shrink-0">
                        {ICONS.empresa}
                    </div>
                    <div className={`flex flex-col min-w-0 transition-all duration-300 ease-in-out overflow-hidden
                        ${isHovered ? 'opacity-100 translate-x-0 w-auto' : 'opacity-0 -translate-x-10 w-0 pointer-events-none'}`}
                    >
                        <span className="text-xs font-bold tracking-wide truncate pr-1">
                            {activeRole}
                        </span>
                        <span className="text-[10px] text-emerald-200 font-medium tracking-wider">
                            {ruc}
                        </span>
                    </div>
                </Link>
                <Link
                    to="/notificaciones"
                    className={`h-12 flex items-center bg-emerald-900/20 hover:bg-white/10 text-emerald-100 rounded-full cursor-pointer transition-all duration-300 ease-in-out group overflow-hidden no-underline
                        ${isHovered ? 'w-[85%]' : 'w-14'}
                    `}
                    title="Notificaciones"
                >

                    <div className="w-14 h-full flex items-center justify-center shrink-0">
                        <div className="transition-transform duration-300 h-full flex items-center group-hover:translate-x-0.5 relative">
                            {unreadCount > 0 && (
                                <div className="absolute -right-1 top-1 p-1 flex justify-center items-center w-4 h-4 bg-red-400 rounded-full text-white text-xs font-bold ready-badge">
                                    {unreadCount}
                                </div>
                            )}
                            <span className="pi pi-bell text-[24px]!"></span>
                        </div>
                    </div>
                    <span className={`font-medium text-sm tracking-wide whitespace-nowrap transition-all duration-300 ease-in-out overflow-hidden
                        ${isHovered ? 'opacity-100 translate-x-0 w-auto' : 'opacity-0 -translate-x-10 w-0 pointer-events-none'}`}
                    >
                        Notificaciones
                    </span>
                </Link>

                <Link
                    to="/configuracion"
                    className={`h-12 flex items-center bg-emerald-900/20 hover:bg-white/10 text-emerald-100 rounded-full cursor-pointer transition-all duration-300 ease-in-out group overflow-hidden no-underline
                        ${isHovered ? 'w-[85%]' : 'w-14'}
                    `}
                    title="Configuración"
                >
                    {/* Caja fija idéntica de w-14 */}

                    <div className="w-14 h-full flex items-center justify-center shrink-0">
                        <div className="transition-transform duration-300 h-full flex items-center group-hover:translate-x-0.5">
                            <span className="pi pi-cog !text-[24px]"></span>
                        </div>
                    </div>
                    <span className={`font-medium text-sm tracking-wide whitespace-nowrap transition-all duration-300 ease-in-out overflow-hidden
                        ${isHovered ? 'opacity-100 translate-x-0 w-auto' : 'opacity-0 -translate-x-10 w-0 pointer-events-none'}`}
                    >
                        Configuración
                    </span>
                </Link>
                {/* BOTÓN CERRAR SESIÓN (DISEÑO INTEGRADO Y UNIFICADO) */}
                <button
                    onClick={logout}
                    className={`h-14 flex items-center bg-red-950/20 hover:bg-red-500/20 text-red-100 rounded-full cursor-pointer active:shadow-inner transition-all duration-300 ease-in-out group overflow-hidden border border-transparent hover:border-red-400/30
                        ${isHovered ? 'w-[85%]' : 'w-14'}
                    `}
                    title="Cerrar Sesión"
                >
                    {/* Caja fija de w-14 */}
                    <div className="w-14 h-full flex items-center justify-center shrink-0">
                        <div className="transition-transform duration-300 group-hover:translate-x-0.5">
                            {ICONS.logout}
                        </div>
                    </div>
                    <span className={`font-bold text-sm tracking-wide whitespace-nowrap transition-all duration-300 ease-in-out overflow-hidden
                        ${isHovered ? 'opacity-100 translate-x-0 w-auto' : 'opacity-0 -translate-x-10 w-0 pointer-events-none'}`}
                    >
                        Cerrar Sesión
                    </span>
                </button>

            </div>
        </div>
    );
};

export default SideBar;