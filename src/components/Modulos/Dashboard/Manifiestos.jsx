import { Chart } from "primereact/chart";
import React from "react";

const Sparkline = ({ data, color, className }) => {
    const chartData = {
        labels: data.map(() => ''),
        datasets: [{
            data: data,
            borderColor: color,
            borderWidth: 2,
            fill: false,
            tension: 0.4,
            pointRadius: 0
        }]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            x: { display: false },
            y: { display: false }
        }
    };

    return <Chart type="line" className={className} data={chartData} options={options} />;
};

const ResumenManifiestos = ({ data }) => {
    // data ahora incluye: total, observados, pendientes, aprobados,
    // tendencias (objeto), historiales (objeto), historialTotal (array)

    const cards = [
        {
            label: "En revisión",
            val: data.total || 0,
            icon: "pi pi-file",
            color: "text-blue-600",
            bgIcon: "bg-blue-100",
            hex: "#2563eb",
            // Usamos el historial total (suma de todos los estados por día)
            historial: data.historialTotal || [0, 0, 0, 0, 0, 0],
            trend: data.tendencias?.TOTAL || "Sin datos",
        },
        {
            label: "Observados",
            val: data.observados || 0,
            icon: "pi pi-exclamation-triangle",
            color: "text-orange-600",
            bgIcon: "bg-orange-100",
            hex: "#f97316",
            historial: data.historiales?.OBSERVADO || [0, 0, 0, 0, 0, 0],
            trend: data.tendencias?.OBSERVADO || "Sin datos",
        },
        {
            label: "Pendientes",
            val: data.pendientes || 0,
            icon: "pi pi-send",
            color: "text-amber-600",
            bgIcon: "bg-amber-100",
            hex: "#f59e0b",
            historial: data.historiales?.PENDIENTE || [0, 0, 0, 0, 0, 0],
            trend: data.tendencias?.PENDIENTE || "Sin datos",
        },
        {
            label: "Aprobados",
            val: data.aprobados || 0,
            icon: "pi pi-check-circle",
            color: "text-emerald-600",
            bgIcon: "bg-emerald-100",
            hex: "#16a34a",
            historial: data.historiales?.APROBADO || [0, 0, 0, 0, 0, 0],
            trend: data.tendencias?.APROBADO || "Sin datos",
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {cards.map((c, i) => (
                <div key={i} className="bg-white px-4 pt-4 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex justify-start gap-4 items-center">
                        <div className={`rounded-full ml-1 flex justify-center items-center h-14 w-14 ${c.bgIcon} ${c.color}`}>
                            <i className={`${c.icon} text-2xl!`}></i>
                        </div>
                        <div className="flex flex-col h-full gap-1 ml-2">
                            <p className="text-gray-500 text-xs font-medium">{c.label}</p>
                            <h4 className="text-3xl font-bold text-gray-800">{c.val}</h4>
                        </div>
                    </div>
                    <div className="py-3 px-1 border-gray-50 flex items-center justify-between">
                        <span className={`text-[12px] w-40 font-bold ${c.color.replace('600', '700')}`}>
                            {c.trend}
                        </span>
                        <div className="h-12 overflow-hidden">
                            <Sparkline data={c.historial} color={c.hex} className="w-full h-full" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ResumenManifiestos;