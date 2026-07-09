import React from "react";
import { Chart } from 'primereact/chart';
import LoadingOverlay from "../../ui/cards/LoadingOverlay";
import ResumenManifiestos from "./Manifiestos";
import NotificacionesWidget from "./NotificacionesDash";
import { useDashboard } from "../../context/useDashboard";
import { useAuth } from "../../context/AuthContext";

const Dashboard = () => {
    const { data, loading, error } = useDashboard();
    const { activeRole } = useAuth();

    const colorMap = {
        APROBADO: '#22c55e',
        OBSERVADO: '#f97316',
        RECHAZADO: '#ef4444',
        "EN REVISION": '#8b5cf6',
        ENVIADO: '#3b82f6',
        PENDIENTE: '#eab308',
        BORRADOR: '#64748b',
    };

    const estadosOrdenados = Object.keys(colorMap);

    if (loading) return <LoadingOverlay message="Cargando dashboard..." />;
    if (error) return <div className="text-red-500 p-4">Error: {error}</div>;
    if (!data) return null;

    const stats = {
        total: data.totalManifiestos,
        generadores: data.totalGeneradores || 0,
        transportistas: data.totalTransportistas || 0,
        vinculaciones: data.vinculacionesActivas || 0,
        aprobados: data.totalAprobados || 0,
    };

    const pieData = {
        labels: estadosOrdenados,
        datasets: [{
            data: estadosOrdenados.map(estado => data.estados[estado] || 0),
            backgroundColor: estadosOrdenados.map(estado => colorMap[estado]),
            borderWidth: 0,
            hoverOffset: 4
        }]
    };

    return (
        // CLAVE: h-full (no h-dvh) -> llena al padre (<main>), no al viewport.
        // En mobile: h-auto y sin overflow-hidden, para que scrollee normal.
        <div className="w-full h-auto md:h-full p-2 flex flex-col md:overflow-hidden gap-4 md:gap-[clamp(0.75rem,1.5vw,1.5rem)]">

            {/* Header: tamaño fluido con clamp, nunca se estira ni se rompe */}
            <div className="flex-none flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div>
                    <h1 className="text-[clamp(1.375rem,1.1vw+1rem,1.875rem)] font-extrabold bg-gradient-to-r from-[#285598] to-blue-400 bg-clip-text text-transparent tracking-tight leading-tight">
                        Hola {activeRole?.charAt(0).toUpperCase() + activeRole?.slice(1).toLowerCase()}
                    </h1>
                    <p className="text-[clamp(0.75rem,0.4vw+0.6rem,0.875rem)] text-gray-500">Gestión operativa de manifiestos</p>
                </div>
                {activeRole === "TRANSPORTISTA" && (
                    <button className="bg-[#285598] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition-all flex items-center gap-2 self-start shrink-0">
                        <i className="pi pi-plus"></i> Nuevo Manifiesto
                    </button>
                )}
            </div>

            {/* Cuerpo: ocupa TODO el resto del alto disponible */}
            <div className="flex-1 min-h-0 grid grid-cols-12 gap-4 md:gap-[clamp(0.75rem,1.5vw,1.5rem)]">

                {/* Columna izquierda */}
                <div className="col-span-12 lg:col-span-9 flex flex-col min-h-0 gap-4 md:gap-[clamp(0.75rem,1.5vw,1.5rem)]">

                    <div className="flex-none">
                        <ResumenManifiestos data={stats} />
                    </div>

                    {/* Fila de gráficos: proporción 3:1 en laptop/tablet, 5:3 en monitores grandes (más aire para la dona) */}
                    <div className="flex-1 min-h-0 grid grid-cols-1 xl:grid-cols-[3fr_1fr] 2xl:grid-cols-[5fr_3fr] gap-4 md:gap-[clamp(0.75rem,1.5vw,1.5rem)]">

                        {/* Gráfico de barras */}
                        <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-[clamp(0.75rem,1.2vw,1.5rem)] flex flex-col min-h-0">
                            <h2 className="text-[clamp(0.65rem,0.35vw+0.5rem,0.8125rem)] font-bold text-gray-400 uppercase tracking-wider mb-2 flex-none">
                                Manifiestos por mes
                            </h2>
                            <div className="flex-1 min-h-0 relative">
                                <Chart
                                    type="bar"
                                    data={{
                                        labels: data.mensual.map(i => i.mes),
                                        datasets: [{ label: 'Manifiestos', data: data.mensual.map(i => i.cantidad), backgroundColor: '#8884d8' }]
                                    }}
                                    options={{ responsive: true, maintainAspectRatio: false }}
                                    className="!absolute !inset-0 !w-full !h-full"
                                />
                            </div>
                        </div>

                        {/* Dona: layout vertical por defecto, HORIZONTAL en 2xl+ (cuando la tarjeta se vuelve corta y ancha por la tabla) */}
                        <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-[clamp(0.75rem,1.2vw,1.5rem)] flex flex-col min-h-0">
                            <h3 className="text-[clamp(0.65rem,0.35vw+0.5rem,0.8125rem)] font-bold text-gray-400 uppercase tracking-wider mb-2 flex-none">
                                Estado de manifiestos
                            </h3>

                            {/* flex-col -> flex-row en 2xl: la dona pasa de estar arriba a estar a la izquierda */}
                            <div className="flex-1 min-h-0 flex flex-col 2xl:flex-row items-center gap-3 2xl:gap-5">

                                {/* Wrapper de la dona: en vertical se limita por ANCHO, en horizontal se limita por ALTO */}
                                <div className="w-full 2xl:w-auto flex-1 2xl:flex-none min-h-0 2xl:h-full flex items-center justify-center">
                                    <div className="relative aspect-square
                    h-full max-h-[clamp(5rem,12vw,11rem)] w-full max-w-[clamp(5rem,12vw,11rem)]
                    2xl:h-full 2xl:max-h-full 2xl:w-auto 2xl:max-w-none
                ">
                                        <Chart
                                            type="doughnut"
                                            data={pieData}
                                            options={{ plugins: { legend: { display: false } }, cutout: '70%', maintainAspectRatio: false }}
                                            className="!absolute !inset-0 !w-full !h-full"
                                        />
                                    </div>
                                </div>

                                {/* Leyenda: ocupa el resto del espacio, centrada verticalmente cuando está a la derecha */}
                                <div className="w-full 2xl:flex-1 flex-none 2xl:h-full flex flex-col justify-center gap-[clamp(0.25rem,0.4vw,0.5rem)] overflow-y-auto max-h-full min-w-0">
                                    {estadosOrdenados.map((estado) => {
                                        const valor = data.estados[estado] || 0;
                                        const total = stats.total || 1;
                                        const porcentaje = ((valor / total) * 100).toFixed(0);
                                        return (
                                            <div key={estado} className="flex items-center justify-between gap-2">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: colorMap[estado] }} />
                                                    <span className="text-[clamp(0.5625rem,0.25vw+0.45rem,0.75rem)] text-gray-600 uppercase truncate">
                                                        {estado.toLowerCase()}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1.5 shrink-0">
                                                    <span className="hidden 2xl:inline text-[clamp(0.5rem,0.2vw+0.4rem,0.625rem)] text-gray-400 font-medium">
                                                        {porcentaje}%
                                                    </span>
                                                    <span className="text-[clamp(0.5625rem,0.25vw+0.45rem,0.75rem)] font-bold text-gray-900">
                                                        {valor}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabla: SOLO aparece si hay espacio ancho de sobra (2xl+), y nunca causa overflow */}
                    <div className="hidden 2xl:flex flex-1 min-h-0 bg-white border border-gray-100 shadow-sm rounded-2xl p-[clamp(0.75rem,1.2vw,1.5rem)] flex-col">
                        <h2 className="text-[clamp(0.65rem,0.35vw+0.5rem,0.75rem)] font-bold text-gray-400 uppercase tracking-wider mb-3 flex-none">
                            Últimos manifiestos
                        </h2>
                        <div className="flex-1 min-h-0 overflow-y-auto">
                            <table className="w-full text-xs">
                                <thead className="sticky top-0 bg-white">
                                    <tr className="text-left text-gray-400 border-b border-gray-100">
                                        <th className="pb-2 font-semibold">ID</th>
                                        <th className="pb-2 font-semibold">Generador</th>
                                        <th className="pb-2 font-semibold">Fecha</th>
                                        <th className="pb-2 font-semibold">Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data?.ultimos?.map((m) => (
                                        <tr key={m.id} className="border-b border-gray-50 last:border-0">
                                            <td className="py-2 font-mono text-[11px] text-gray-600">{m.numero}</td>
                                            <td className="py-2 text-[11px] text-gray-700">{m.generador}</td>
                                            <td className="py-2 text-[11px] text-gray-500">{new Date(m.fecha).toLocaleDateString()}</td>
                                            <td className="py-2">
                                                <span
                                                    className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                                                    style={{ backgroundColor: `${colorMap[m.estado] || '#64748b'}20`, color: colorMap[m.estado] || '#64748b' }}
                                                >
                                                    {m.estado}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Columna derecha: notificaciones, a tope, altura completa siempre */}
                <div className="col-span-12 lg:col-span-3 min-h-0">
                    <NotificacionesWidget />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;