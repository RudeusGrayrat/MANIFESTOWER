import { Outlet, useLocation } from "react-router-dom";

const AuthLayout = () => {
    const location = useLocation();
    const isRegister = location.pathname === "/registrar";

    return (
        <div className="min-h-screen w-screen relative overflow-hidden bg-white">

            {/* Inyección de animación fluida sincronizada con los 500ms del deslizamiento */}
            <style>{`
                @keyframes authContentFade {
                    0% { opacity: 0; transform: scale(0.97); filter: blur(4px); }
                    40% { opacity: 0; } /* Se mantiene invisible durante el pico del movimiento e intercambio de ancho */
                    100% { opacity: 1; transform: scale(1); filter: blur(0); }
                }
                .animate-auth-fade {
                    animation: authContentFade 0.55s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                }
            `}</style>

            {/* 1. PANEL DE LA IMAGEN (Se mueve de izquierda a derecha) */}
            <div
                className={`absolute top-0 h-full bg-cover bg-center bg-no-repeat transition-all duration-500 ease-in-out z-0
                    w-[calc(100vw-663px)] max-2xl:w-[calc(100vw-500px)] max-md:w-0 max-md:opacity-0
                    ${isRegister
                        ? "left-[663px] max-xl:left-[700px]"
                        : "left-0"
                    }`}
                style={{ backgroundImage: "url('MANIFIESTO_LOGO7.webp')" }}
            />

            {/* 2. PANEL DEL FORMULARIO / OUTLET (Se mueve de derecha a izquierda) */}
            <div
                style={{
                    boxShadow: isRegister
                        ? "10px 0 30px rgba(0, 0, 0, 0.15)"
                        : "-10px 0 30px rgba(0, 0, 0, 0.15)",
                }}
                className={`absolute top-0 h-screen flex flex-col justify-start bg-white px-8 py-8 z-10 transition-all duration-500 ease-in-out
                    max-md:w-full max-md:left-0
                    ${isRegister
                        ? "left-0 w-[800px]"
                        : "left-[calc(100vw-663px)] max-2xl:left-[calc(100vw-500px)] w-[663px] max-2xl:w-[500px] max-2xl:w-[500px]"
                    }`}
            >
                {/* Logo de la empresa - Transición nativa fluida sin romper el flujo físico con display:none */}
                <div
                    className={`w-full transition-all duration-500 ease-in-out shrink-0 flex justify-center items-center overflow-hidden
                        ${isRegister
                            ? "opacity-0 h-0 my-0 -translate-y-6 pointer-events-none"
                            : "opacity-100 h-24 max-2xl:my-12 my-20 translate-y-0"
                        }`}
                >
                    <img src="/TOWER_LOGO.svg" alt="Logo" className="h-full w-auto" />
                </div>

                {/* Contenedor del contenido con KEY dinámica para controlar el renderizado y animación */}
                <div
                    key={location.pathname}
                    className="animate-auth-fade h-full max-h-screen flex-1 flex flex-col justify-start min-h-0"
                >
                    <Outlet />
                </div>
            </div>

        </div>
    );
};

export default AuthLayout;