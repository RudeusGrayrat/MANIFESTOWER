import { useEffect, useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { useNotificaciones } from "../context/NotificacionesContext";

const Badge = ({ type }) => {
    const styles = {
        GLOBAL: "text-purple-700 border-purple-100",
        SUBMODULE: "text-blue-700 border-blue-100",
        INDIVIDUAL: "bg-green-50 text-green-700 border-green-100",
    };
    return (
        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-lg border ${styles[type] || "text-gray-700"}`}>
            {type}
        </span>
    );
};

const Notificaciones = () => {
    // 🔌 CONSUMO DEL NUEVO CONTEXTO (Reemplazo total de Redux)
    const {
        allNotificaciones,
        pagination,
        loading,
        getNotificaciones,
        marcarComoLeida
    } = useNotificaciones();

    const { user } = useAuth();

    // ⚙️ ESTADOS LOCALES
    const [selectedId, setSelectedId] = useState(null);
    const [exitingIds, setExitingIds] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDate, setSelectedDate] = useState(""); // Filtro de fecha YYYY-MM-DD
    const [page, setPage] = useState(1);

    // 🔄 Cargar las notificaciones por página y por filtros activos mediante el Contexto
    useEffect(() => {
        if (user?._id) {
            // El contexto centraliza y realiza la petición HTTP con los parámetros reactivos
            getNotificaciones(page, 10, searchTerm, selectedDate);
            console.log("Fetching notifications for user:", user._id, "Page:", page, "Search:", searchTerm, "Date:", selectedDate);
        }
    }, [user?._id, searchTerm, selectedDate, page, getNotificaciones]);

    // Manejadores controlados para forzar el reinicio de la página a 1 al cambiar filtros
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setPage(1);
    };

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
        setPage(1);
    };

    const clearFilters = () => {
        setSearchTerm("");
        setSelectedDate("");
        setPage(1);
    };

    // 🧠 PROCESADOR Y FILTRADO INMUTABLE
    const filteredNotes = useMemo(() => {
        return allNotificaciones?.map((n) => {
            const yaLeido = n.type === "INDIVIDUAL"
                ? n.isReadIndividual
                : n.readBy?.some(read => (read.userId?._id || read.userId) === user?._id);

            const dateFormatted = n.createdAt
                ? new Date(n.createdAt).toLocaleDateString("es-ES", { hour: "2-digit", minute: "2-digit" })
                : "Reciente";

            return {
                id: n._id,
                title: n.title || "",
                message: n.message || "",
                type: n.type,
                entity: n.type === "SUBMODULE" ? "ERP" : "SISTEMA",
                time: dateFormatted,
                read: yaLeido || false,
                isExiting: exitingIds.includes(n._id),
            };
        });
    }, [allNotificaciones, user?._id, exitingIds]);
    console.log("Filtered notifications:", filteredNotes);
    // 🛠️ ACCIONES CONECTADAS AL CONTEXTO
    const markRead = (id) => {
        if (user?._id) {
            marcarComoLeida(id); // Ejecuta el patch y muta el estado local de forma optimista
        }
    };

    const remove = (id) => {
        setExitingIds((prev) => [...prev, id]);
        setTimeout(() => {
            setExitingIds((prev) => prev.filter((exId) => exId !== id));
        }, 300);
    };

    const marcarLeido = (n) => {
        setSelectedId(selectedId === n.id ? null : n.id);
        console.log("Clicked notification:", n);
        if (!n.read) markRead(n.id); // Solo actúa si no está leída
    };

    return (
        <div className=" mt-8 overflow-auto">

            {/* CABECERA */}
            <div className="flex flex-col px-2 items-start gap-1 mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Centro de Notificaciones</h2>
                <p className="text-sm text-gray-500">Mantente al tanto de tus manifiestos y estados operativos</p>
            </div>

            {/* FILTROS INTERACTIVOS */}
            <div className="flex flex-wrap px-2 items-center gap-4 mb-4 max-w-2xl">
                {/* Input de búsqueda por texto */}
                <div className="relative flex-1 min-w-[260px]">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                        <i className="pi pi-search"></i>
                    </span>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="Buscar por título o contenido..."
                        className="w-full p-2.5 pl-10 rounded-xl text-sm border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all shadow-sm bg-gray-50"
                    />
                </div>

                {/* Input de Fecha Interactivo */}
                <div className="relative shrink-0">
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={handleDateChange}
                        className="p-2.5 rounded-xl text-sm border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all shadow-sm bg-gray-50 text-gray-700 font-medium cursor-pointer"
                    />
                </div>

                {/* Botón de Limpieza rápido */}
                {(searchTerm || selectedDate) && (
                    <button
                        onClick={clearFilters}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                        Limpiar filtros
                    </button>
                )}
            </div>

            {/* FEED DE NOTIFICACIONES */}
            <div className="overflow-hidden">
                <ul className="gap-4 flex flex-col p-2">
                    {filteredNotes?.map((n) => (
                        <li
                            key={n.id}
                            onClick={() => marcarLeido(n)}
                            className={`flex flex-col md:flex-row gap-4 p-5 border border-gray-100 shadow-sm items-center rounded-xl hover:bg-gray-100/50 hover:shadow-lg cursor-pointer transition-all duration-300 ${n.read ? "bg-white opacity-90" : "bg-white border-l-4 border-l-blue-500 shadow-md font-medium"
                                } ${n.isExiting ? "opacity-0 translate-x-8 max-h-0 !p-0 !my-0 overflow-hidden border-none shadow-none" : "max-h-[500px]"
                                }`}
                        >
                            <div className="flex-1 h-full w-full">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3 ">
                                        <div className={`w-3 h-3 rounded-full mt-0.5 shrink-0 transition-colors duration-300 ${n.read ? "bg-gray-300" : "bg-blue-500 animate-pulse"}`} />
                                        <div className="text-base text-gray-900 flex items-center gap-2">
                                            {n.title}
                                            <span className="text-xs font-normal text-gray-400">• {n.entity}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 shrink-0">
                                        <Badge type={n.type} />
                                        <div className="text-xs text-gray-800 whitespace-nowrap">{n.time}</div>
                                        <div className="flex gap-2 self-end md:self-center shrink-0 w-full md:w-auto justify-end border-t md:border-none pt-3 md:pt-0 mt-2 md:mt-0">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    remove(n.id);
                                                }}
                                                className="text-xs px-3 py-1.5 bg-red-50 text-red-600 font-medium border border-red-100 rounded-lg hover:bg-red-100 transition-colors shadow-sm"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className={`grid transition-all duration-300 ease-in-out ${selectedId === n.id ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0"}`}>
                                    <div className="overflow-hidden">
                                        <div className="p-4 rounded-lg border border-gray-300/60 text-sm text-gray-700 leading-relaxed shadow-inner">
                                            <span className="font-semibold block text-gray-900 mb-1">Descripción Completa:</span>
                                            {n.message}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}

                    {/* ESTADO VACÍO O LOADING */}
                    {filteredNotes.length === 0 && (
                        <div className="p-12 text-center bg-gray-50 border border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center">
                            <span className="text-3xl mb-2">{loading ? "⏳" : "🔍"}</span>
                            <div className="font-semibold text-gray-800 text-base">
                                {loading ? "Cargando..." : "Sin resultados"}
                            </div>
                            <div className="text-sm text-gray-500 mt-0.5">
                                {loading ? "Buscando alertas actualizadas en el servidor." : "No hay notificaciones para los filtros seleccionados."}
                            </div>
                        </div>
                    )}
                </ul>
            </div>

            {/* 📑 BOTÓN CARGAR MÁS */}
            {pagination?.hasNextPage && (
                <div className="flex justify-center mt-6 mb-12">
                    <button
                        onClick={() => setPage((prevPage) => prevPage + 1)}
                        className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 transition-all"
                    >
                        <i className="pi pi-plus text-[10px]"></i> Cargar más notificaciones
                    </button>
                </div>
            )}

        </div>
    );
};

export default Notificaciones;