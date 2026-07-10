// src/Modules/Certificación/Manifiestos/Permissions/Detail.jsx
import { useEffect, useState } from "react";
import { useToast } from "../../../notificaciones/ToastContext";
import axios from "../../../api/axios";
import PDetail from "../../../ui/cards/PDetail";
import Details from "../../../ui/Permissions/Detail";

const DetailGenerador = ({ setShowDetail, selected }) => {
    const { showError } = useToast();
    const {
        razonSocial,
        ruc,
        correoElectronico,
        direccion,
        telefono,
        representanteLegal,
        dniRepresentante,
        estado,

        plantas,
        responsablesTecnicos,

        createdAt,
        updatedAt
    } = selected;
    console.log("Selected Transportista:", selected);
    if (!selected) {
        showError("No se ha seleccionado ningún transportista para mostrar los detalles.");
        return null;
    }

    return (
        <Details setShowDetail={setShowDetail} title={`Generador: ${razonSocial || "Detalle"}`}>
            <div className="justify-center gap-4 sm:gap-x-8 grid grid-cols-1 md:grid-cols-2">
                <div className="flex min-w-0 flex-col gap-1 bg-white border-gray-200 border rounded-xl p-4 sm:p-6 shadow-lg">
                    <span className="text-xl sm:text-3xl mb-2 font-bold text-[#026DCC]">DATOS DEL GENERADOR</span>
                    <PDetail content="Razón Social: " value={razonSocial} />
                    <PDetail content="RUC: " value={ruc} />
                    <PDetail content="Correo Electrónico: " value={correoElectronico} />
                    <PDetail content="Teléfono: " value={telefono} />
                    <PDetail content="Dirección: " value={direccion} />
                    <PDetail content="Nombre de Representante: " value={representanteLegal} />
                    <PDetail content="DNI/CE de Representante: " value={dniRepresentante} />
                    <p className="text-xl text-gray-700 my-0">
                        <strong className="text-gray-700 mr-2">Estado: </strong>
                        <span className={`${estado === "ACTIVO" ? "text-green-600" : "text-red-600"} font-semibold`}>
                            {estado}
                        </span>
                    </p>
                </div>
                {/* DATOS DE PLANTA */}
                <div className="flex min-w-0 flex-col overflow-y-auto max-h-[47vh] gap-1 bg-white border-gray-200 border rounded-xl p-4 shadow-lg">
                    <span className="text-xl sm:text-3xl font-bold mb-2 text-[#026DCC]">DATOS DE PLANTA</span>
                    {/* platas al ser un array se deb hacer un mapeo para reenderizar los multiples datos de planta */}
                    {plantas && plantas.length > 0 ? (
                        plantas.map((planta, index) => (
                            <div key={index} className={` flex flex-col gap-1 ${plantas.length > 1 ? " border-b border-gray-300  mb-4 pb-3" : ""}`}>
                                <PDetail content="Denominación: " value={planta.denominacion} />
                                <PDetail content="Tipo de Planta: " value={planta.tipoPlanta} />
                                <PDetail content="Dirección: " value={planta.direccion} />
                                <PDetail content="Ubigeo: " value={planta.ubigeoId?.codigo} />
                                <PDetail content="Actividad Económica: " value={planta.actividadEconomica} />
                                <PDetail content="Sector" value={planta.sector} />
                                <PDetail content="Coordenadas Utm: " value={planta.coordenadasUtm ? `Norte: ${planta.coordenadasUtm.norte}, Este: ${planta.coordenadasUtm.este}, Zona: ${planta.coordenadasUtm.zona}` : "No registrado"} />
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-600">No hay plantas registradas.</p>
                    )}
                </div>
            </div>
            {/* RESPONSABLES */}
            <div className="flex flex-col max-h-[40vh] p-4 sm:p-6 sm:py-4  gap-4 sm:gap-10 bg-white border-gray-200 border rounded-xl shadow-lg">
                <span className="text-xl sm:text-3xl font-bold text-[#026DCC]">RESPONSABLE(S)</span>
                {responsablesTecnicos && responsablesTecnicos.length > 0 ? (
                    responsablesTecnicos.map((responsable, index) => (
                        <div key={index} className={`${responsablesTecnicos.length > 1 ? "border-b sm:border-b-0 sm:border-r border-gray-300 pb-4 sm:pr-8" : ""}`}>
                            <PDetail content="Nombre: " value={responsable.nombreResponsable} />
                            <PDetail content="DNI: " value={responsable.dniResponsable} />
                            <PDetail content="Cargo: " value={responsable.cargoResponsable} />
                            <PDetail content="Correo: " value={responsable.correoResponsable} />
                            <PDetail content="Teléfono: " value={responsable.telefonoResponsable} />
                        </div>
                    ))
                ) : (
                    <p className="text-gray-600">No hay responsables técnicos registrados.</p>
                )}
            </div>
        </Details>
    );
};

export default DetailGenerador
