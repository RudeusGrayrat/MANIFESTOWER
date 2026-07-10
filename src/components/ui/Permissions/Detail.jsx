import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

const Details = ({ setShowDetail, title = "Detalle", children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const containerRef = useRef(null);
    const [size, setSize] = useState({ width: 0, height: 0 });

    // Medimos el contenedor para que el SVG sepa cuánto espacio tiene
    // Variables de diseño fijas
    const gap = 120; // Tamaño exacto de la mordida
    const r = 20;   // Radio de las esquinas redondeadas
    useEffect(() => {
        if (containerRef.current) {
            const { offsetWidth, offsetHeight } = containerRef.current;
            setSize({ width: offsetWidth, height: offsetHeight });
        }
    }, [children]); // Se recalcula si cambian los datos internos

    // Details.jsx
    const handleCloseDetail = () => {
        setShowDetail(false);

        const searchParams = new URLSearchParams(location.search);
        searchParams.delete("view"); // Solo elimina el param de detalle

        const newSearch = searchParams.toString();
        navigate(`${location.pathname}${newSearch ? `?${newSearch}` : ""}`);
    };


    // Coordenadas del Path Dinámico
    // W = Ancho total, H = Alto total
    const w = size.width;
    const h = size.height;

    const dynamicPath = w > 0 ? `
    M ${r},0 
    H ${w - gap - r} 
    Q ${w - gap},0 ${w - gap},${r} 
    V ${gap - r} 
    Q ${w - gap},${gap} ${w - gap + r},${gap} 
    H ${w - r} 
    Q ${w},${gap} ${w},${gap + r} 
    V ${h - r} 
    Q ${w},${h} ${w - r},${h} 
    H ${r} 
    Q 0,${h} 0,${h - r} 
    V ${r} 
    Q 0,0 ${r},0 
    Z
  ` : "";

    return (
        <div className="w-screen h-[100dvh] fixed inset-0 z-40 flex items-center justify-center bg-black/30 p-3 sm:pl-20 sm:pr-6 backdrop-blur-sm">
           <div 
        ref={containerRef} 
        className="relative w-full max-w-[90%] max-h-[94dvh] min-h-0 flex flex-col overflow-hidden 
                   bg-slate-50 rounded-2xl 
                   sm:bg-transparent sm:rounded-none sm:min-w-[80%] sm:max-h-[90%] sm:min-h-[50%]"
    >
                <div className="absolute inset-0 -z-10 hidden sm:block">
                    <svg width="100%" height="100%" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="modalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#f9fafb" />
                                <stop offset="100%" stopColor="#f3f4f6" />
                            </linearGradient>
                        </defs>
                        {w > 0 && (
                            <path
                                d={dynamicPath}
                                fill="url(#modalGrad)"
                                stroke="#e5e7eb"
                                strokeWidth="1"
                            />
                        )}
                    </svg>
                </div>

                {/* BOTÓN X - Siempre calza en el hueco de 140px */}
                <div className="absolute top-3 right-3 sm:top-1 sm:right-1 flex items-center justify-center z-50">
                    <button
                        onClick={handleCloseDetail}
                        aria-label="Cerrar detalle"
                        className="h-11 w-11 text-lg sm:h-24 sm:w-24 sm:text-3xl text-white rounded-full bg-gradient-to-tr from-[#2b5993] to-[#418fda] shadow-xl hover:scale-90 transition-transform"
                    >
                        <span className="sm:hidden">×</span><span className="hidden sm:inline">X</span>
                    </button>
                </div>

                <div className="detail-content p-4 pt-16 sm:p-10 sm:pr-40 grid gap-5 sm:gap-8 overflow-y-auto w-full h-full" >
                    <h2 className="pr-12 text-lg font-bold text-slate-800 sm:hidden">{title}</h2>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Details;
