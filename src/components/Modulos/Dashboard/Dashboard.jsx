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
        <div className="w-full min-h-screen p-4 md:p-6 bg-gray-50/50">
            <div className="w-full mx-auto">
                {/* Header */}
                <div className="mb-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-[#285598] to-blue-400 bg-clip-text text-transparent tracking-tight">
                            Hola {activeRole?.charAt(0).toUpperCase() + activeRole?.slice(1).toLowerCase()}
                        </h1>
                        <p className="text-sm text-gray-500">Gestión operativa de manifiestos</p>
                    </div>
                    {activeRole === "TRANSPORTISTA" && (
                        <button className="bg-[#285598] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition-all flex items-center gap-2 self-start">
                            <i className="pi pi-plus"></i> Nuevo Manifiesto
                        </button>
                    )}
                </div>

                {/* Grid principal */}
                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-12 lg:col-span-9 flex flex-col gap-6">
                        <ResumenManifiestos data={stats} />

                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                            <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-6">
                                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Manifiestos por mes</h2>
                                <div className="h-48">
                                    <Chart type="bar" data={{ labels: data.mensual.map(i => i.mes), datasets: [{ label: 'Manifiestos', data: data.mensual.map(i => i.cantidad), backgroundColor: '#8884d8' }] }} options={{ responsive: true, maintainAspectRatio: false }} />
                                </div>
                            </div>
                            <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-6">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Estado de manifiestos</h3>
                                <div className="flex items-center gap-6">
                                    <div className="w-28 h-28"><Chart type="doughnut" data={pieData} options={{ plugins: { legend: { display: false } }, cutout: '70%' }} /></div>
                                    <div className="flex-1 flex flex-col gap-2">
                                        {estadosOrdenados.map((estado) => (
                                            <div key={estado} className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colorMap[estado] }} />
                                                    <span className="text-[11px] text-gray-600 uppercase">{estado.toLowerCase()}</span>
                                                </div>
                                                <span className="text-[11px] font-bold text-gray-900">{data.estados[estado] || 0}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-12 lg:col-span-3">
                        <NotificacionesWidget />
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Dashboard;