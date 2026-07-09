import { Chart } from "primereact/chart";
import React from "react";

const Sparkline = ({ data, color, className }) => {
    // Generamos labels vacíos para que coincidan con la longitud de los datos
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
        maintainAspectRatio: false, // ¡Muy importante!
        plugins: { legend: { display: false } },
        scales: {
            x: { display: false },
            y: { display: false }
        }
    };

    return <Chart type="line" className={className} data={chartData} options={options} />;
};

const ResumenManifiestos = ({ data }) => {
    const esGenerador = !!data.transportistas;

    // Definimos la configuración visual de cada tarjeta
    const cards = [
        {
            label: "En revisión",
            val: data.total,
            icon: "pi pi-file",
            color: "text-blue-600",
            bgIcon: "bg-blue-100",
            trend: "+12 desde ayer",
            hex: "#2563eb",
            historial: [5, 12, 8, 15, 12]
        },
        {
            label: "Observados",
            val: data.observados || 0, // Asegúrate de traer este valor de tu API
            icon: "pi pi-exclamation-triangle",
            color: "text-orange-600",
            bgIcon: "bg-orange-100",
            trend: "4 requieren atención",
            hex: "#f97316",
            historial: [3, 6, 4, 7, 5]
        },
        {
            label: "Pendientes",
            val: data.pendientes || 0,
            icon: "pi pi-send",
            color: "text-amber-600",
            bgIcon: "bg-amber-100",
            trend: "Esperando generador",
            hex: "#f59e0b",
            historial: [2, 5, 3, 0, 4]
        },
        {
            label: "Aprobados",
            val: data.aprobados,
            icon: "pi pi-check-circle",
            color: "text-emerald-600",
            bgIcon: "bg-emerald-100",
            trend: "95% completados",
            hex: "#16a34a",
            historial: [10, 20, 15, 30, 25]
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {cards.map((c, i) => (
                <div key={i} className="bg-white px-4 pt-4 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex justify-start gap-4  items-center ">
                        <div className={` rounded-full ml-1 flex justify-center items-center h-14 w-14 ${c.bgIcon} ${c.color}`}>
                            <i className={`${c.icon}  text-2xl! `}></i>
                        </div>
                        <div className="flex flex-col h-full gap-1 ml-2">
                            <p className="text-gray-500 text-xs font-medium">{c.label}</p>
                            <h4 className="text-3xl font-bold text-gray-800">{c.val}</h4>
                        </div>
                    </div>
                    <div className=" py-3 px-1  border-gray-50 flex items-center justify-between">
                        <span className={`text-[12px] w-40 font-bold ${c.color.replace('600', '700')}`}>
                            {c.trend}
                        </span>
                        {/* Opcional: Pequeña representación visual de gráfica */}
                        <div className="h-12  overflow-hidden">
                            <Sparkline data={c.historial} color={c.hex} className="w-full h-full" />
                        </div>
                    </div>

                </div>
            ))}

        </div>
    );
};

export default ResumenManifiestos;