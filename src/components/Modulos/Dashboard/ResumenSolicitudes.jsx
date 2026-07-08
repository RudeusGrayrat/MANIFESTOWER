// components/Modulos/Dashboard/ResumenSolicitudes.jsx
import React, { useMemo } from "react";

const ResumenSolicitudes = ({ solicitudes }) => {
    const stats = useMemo(() => {
        const pendientes = solicitudes.filter(s => s.status === "PENDIENTE").length;
        const total = solicitudes.length;

        return { pendientes, total };
    }, [solicitudes]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-slate-500 text-xs font-bold uppercase">Pendientes</p>
                    <h4 className="text-3xl font-bold text-amber-600">{stats.pendientes}</h4>
                </div>
                <div className="bg-amber-50 p-3 rounded-lg text-amber-600">
                    <i className="pi pi-clock text-xl"></i>
                </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-slate-500 text-xs font-bold uppercase">Total Vinculaciones</p>
                    <h4 className="text-3xl font-bold text-slate-800">{stats.total}</h4>
                </div>
                <div className="bg-slate-100 p-3 rounded-lg text-slate-600">
                    <i className="pi pi-users text-xl"></i>
                </div>
            </div>

            {/* Espacio reservado para un tercer indicador (ej: últimos manifiestos) */}
            <div className="bg-gradient-to-r from-[#285598] to-[#1e4075] p-5 rounded-xl shadow-sm text-white flex flex-col justify-center">
                <p className="text-blue-100 text-xs font-bold uppercase">Estado Actual</p>
                <h4 className="text-lg font-semibold">Sistema Activo</h4>
            </div>
        </div>
    );
};

export default ResumenSolicitudes;