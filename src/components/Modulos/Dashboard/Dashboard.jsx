import React from "react";
import LoadingOverlay from "../../ui/cards/LoadingOverlay";
import { useDashboard } from "../../context/useDashboard";
import ResumenManifiestos from "./Manifiestos";
import NotificacionesWidget from "./NotificacionesDash";
import { useAuth } from "../../context/AuthContext";
import { Chart } from 'primereact/chart';

const Dashboard = () => {
    const { data, loading, error } = useDashboard();
    const { activeRole } = useAuth();

    if (loading) return <LoadingOverlay message="Cargando dashboard..." />;
    if (error) return <div className="text-red-500 p-4">Error: {error}</div>;
    if (!data) return null;

    // Indicadores
    const stats = {
        total: data.totalManifiestos,
        generadores: data.totalGeneradores || 0,
        transportistas: data.totalTransportistas || 0,
        vinculaciones: data.vinculacionesActivas || 0,
        aprobados: data.totalAprobados || 0,
    };

    // Datos para gráfico de dona (Chart.js)
    const pieData = {
        labels: Object.keys(data.estados || {}).filter(key => data.estados[key] > 0),
        datasets: [
            {
                data: Object.values(data.estados || {}).filter(val => val > 0),
                backgroundColor: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF6B6B', '#FFA07A'],
                hoverBackgroundColor: ['#0050b3', '#00997a', '#e6a800', '#cc6600', '#8b00cc', '#cc0000', '#cc7a00']
            }
        ]
    };

    // Datos para gráfico de barras (Chart.js)
    const barData = {
        labels: data.mensual.map(item => item.mes),
        datasets: [
            {
                label: 'Manifiestos',
                data: data.mensual.map(item => item.cantidad),
                backgroundColor: '#8884d8',
                borderColor: '#5555aa',
                borderWidth: 1
            }
        ]
    };

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                ticks: { stepSize: 1 }
            }
        }
    };

    return (
        <div className="h-full w-full  overflow-y-auto">
            {/* Header compacto */}
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-[#285598] to-blue-400 bg-clip-text text-transparent tracking-tight">
                        Hola {activeRole ? activeRole.charAt(0).toUpperCase() + activeRole.slice(1).toLowerCase() : ""}
                    </h1>
                    <p className="text-sm text-gray-500 mt-0.5">Gestión operativa de manifiestos</p>
                </div>
                <div className="flex gap-3 ">
                    {activeRole === "TRANSPORTISTA" && (
                        <button className="bg-[#285598] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition-all flex items-center gap-2">
                            <i className="pi pi-plus"></i> Nuevo Manifiesto
                        </button>
                    )}
                </div>
            </div>

            {/* Grid principal */}
            <div className="grid grid-cols-12 gap-4 md:gap-6">
                {/* Columna izquierda (8/12) */}
                <div className="col-span-12 lg:col-span-8 space-y-4 md:space-y-6">
                    <ResumenManifiestos data={stats} />

                    {/* Gráfico de barras mensual */}
                    <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-6">
                        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Manifiestos por mes</h2>
                        <div className="w-full" style={{ height: '200px' }}>
                            <Chart type="bar" data={barData} options={barOptions} />
                        </div>
                    </div>

                    {/* Últimos Manifiestos */}
                    <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-6">
                        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Últimos Manifiestos</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-gray-500 border-b">
                                        <th className="pb-2">ID</th>
                                        <th className="pb-2">Generador</th>
                                        <th className="pb-2 hidden sm:table-cell">Fecha</th>
                                        <th className="pb-2">Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data?.ultimos?.map((m) => (
                                        <tr key={m.id} className="border-b last:border-0">
                                            <td className="py-2 font-mono text-xs md:text-sm">{m.numero}</td>
                                            <td className="py-2 text-xs md:text-sm">{m.generador}</td>
                                            <td className="py-2 hidden sm:table-cell text-xs md:text-sm">{new Date(m.fecha).toLocaleDateString()}</td>
                                            <td className="py-2">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${m.estado === "APROBADO" ? "bg-green-100 text-green-700" :
                                                    m.estado === "PENDIENTE" ? "bg-yellow-100 text-yellow-700" :
                                                        m.estado === "RECHAZADO" ? "bg-red-100 text-red-700" :
                                                            m.estado === "ENVIADO" ? "bg-blue-100 text-blue-700" :
                                                                "bg-gray-100 text-gray-700"
                                                    }`}>
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

                {/* Columna derecha (4/12) */}
                <div className="col-span-12 lg:col-span-4 space-y-4 md:space-y-6">
                    {/* Gráfico de dona */}
                    <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col items-center">
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">Distribución de Estados</h3>
                        <div className="w-full max-w-[200px] md:max-w-[250px]">
                            <Chart type="doughnut" data={pieData} />
                        </div>
                    </div>

                    <NotificacionesWidget />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;