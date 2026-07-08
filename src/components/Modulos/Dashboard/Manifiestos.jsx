import React from "react";

const ResumenManifiestos = ({ data }) => {
    // data: { total, generadores, transportistas, vinculaciones, aprobados }
    const esGenerador = !!data.transportistas; // si tiene transportistas, es porque es generador
    const cards = [
        { label: "Total Manifiestos", val: data.total, color: "text-blue-600", bg: "bg-blue-50" },
        { label: esGenerador ? "Total Transportistas" : "Total Generadores", val: esGenerador ? data.transportistas : data.generadores, color: "text-purple-600", bg: "bg-purple-50" },
        { label: "Vinculaciones Activas", val: data.vinculaciones, color: "text-teal-600", bg: "bg-teal-50" },
        { label: "Manifiestos Aprobados", val: data.aprobados, color: "text-emerald-600", bg: "bg-emerald-50" },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {cards.map((c, i) => (
                <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-slate-500 text-[10px] font-bold uppercase">{c.label}</p>
                    <h4 className={`text-2xl font-bold ${c.color}`}>{c.val}</h4>
                </div>
            ))}
        </div>
    );
};

export default ResumenManifiestos;