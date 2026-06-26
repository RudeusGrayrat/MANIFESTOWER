// src/Modules/Certificación/Manifiestos/Permissions/Detail.jsx
import { useEffect, useState } from "react";
import { useToast } from "../../../notificaciones/ToastContext";
import axios from "../../../api/axios";
import Details from "../../../ui/Permissions/Detail";
import PDetail from "../../../ui/cards/PDetail";

const DetailTransportista = ({ setShowDetail, selected }) => {
    const { showError } = useToast();

    if (!selected) {
        showError("No se ha seleccionado ningún transportista para mostrar los detalles.");
        return null;
    }

    const {
        razonSocial,
        ruc,
        registroEors,
        autorizacionMunicipal,
        documentoRuta,
        direccion,
        correoElectronico,
        telefono,
        representanteLegal,
        responsableTecnico,
        estado,
        contingencias,
        generadores,
        conductores,
        ubigeoId
    } = selected;

    console.log("Selected Transportista:", selected);
    console.log("generadores:", generadores);

    return (
        <Details setShowDetail={setShowDetail} title={`Manifiesto ${selected?.numeroManifiesto || ''}`}>
            {/* 🌟 CAMBIO PRINCIPAL: Grid responsivo (1 col en móvil, 2 en tablet, 3 en pantallas grandes) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10 w-full auto-rows-max">

                {/* COLUMNA 1: DATOS DEL TRANSPORTISTA */}
                <div className="flex w-full flex-col gap-6 bg-white p-6 rounded-lg shadow-md border border-slate-100">
                    <div className="flex flex-col gap-2">
                        {/* Ajuste de tamaño de texto para que no rompa en columnas estrechas */}
                        <h3 className="text-xl md:text-2xl font-bold text-[#026DCC] tracking-tight mb-2">
                            DATOS DEL TRANSPORTISTA
                        </h3>
                        <PDetail content="RAZÓN SOCIAL: " value={razonSocial} />
                        <PDetail content="RUC: " value={ruc} />
                        <PDetail content="REGISTRO EO-RS: " value={registroEors} />
                        <PDetail content="AUTORIZACIÓN MUNICIPAL: " value={autorizacionMunicipal} />
                        <PDetail content="DOCUMENTO DE RUTA: " value={documentoRuta} />
                        <PDetail content="DIRECCIÓN: " value={direccion} />
                        <PDetail content="CORREO ELECTRÓNICO: " value={correoElectronico} />
                        <PDetail content="TELÉFONO: " value={telefono} />
                        <PDetail content="ESTADO: " value={estado} />
                    </div>

                    {(responsableTecnico && responsableTecnico?.nombre && generadores?.length > 0) && (
                        <div className="flex flex-col gap-2 pt-4 border-t border-slate-100">
                            <h3 className="text-xl md:text-2xl font-bold text-[#026DCC] tracking-tight mb-2">
                                RESPONSABLE TÉCNICO
                            </h3>
                            <PDetail content="NOMBRE: " value={responsableTecnico.nombre} />
                            <PDetail content="N° COLEGIATURA: " value={responsableTecnico.numeroColegiatura} />
                        </div>
                    )}
                </div>

                {/* COLUMNA 2: CONTINGENCIAS Y UBICACIÓN */}
                <div className="flex w-full flex-col gap-6 bg-white p-6 rounded-lg shadow-md border border-slate-100">
                    <div className="flex flex-col gap-2">
                        <h3 className="text-xl md:text-2xl font-bold text-[#026DCC] tracking-tight mb-2">
                            CONTINGENCIAS
                        </h3>
                        <PDetail content="DERRAME: " value={contingencias?.derrame || "No especificado"} />
                        <PDetail content="INFILTRACIÓN: " value={contingencias?.infiltracion || "No especificado"} />
                        <PDetail content="INCENDIO: " value={contingencias?.incendio || "No especificado"} />
                        <PDetail content="EXPLOSIÓN: " value={contingencias?.explosion || "No especificado"} />
                        <PDetail content="OTROS ACCIDENTES: " value={contingencias?.otros || "No especificado"} />
                    </div>

                    <div className="flex flex-col gap-2 pt-4 border-t border-slate-100">
                        <h3 className="text-xl md:text-2xl font-bold text-[#026DCC] tracking-tight mb-2">
                            UBICACIÓN
                        </h3>
                        <PDetail content="UBIGEO: " value={ubigeoId?.codigo} />
                        <PDetail content="DEPARTAMENTO: " value={ubigeoId?.departamento} />
                        <PDetail content="PROVINCIA: " value={ubigeoId?.provincia} />
                        <PDetail content="DISTRITO: " value={ubigeoId?.distrito} />
                    </div>

                    {(representanteLegal && generadores?.length > 0) && (
                        <div className="flex flex-col gap-2 pt-4 border-t border-slate-100">
                            <h3 className="text-xl md:text-2xl font-bold text-[#026DCC] tracking-tight mb-2">
                                REPRESENTANTE LEGAL
                            </h3>
                            <PDetail content="NOMBRE: " value={representanteLegal.nombre} />
                            <PDetail content="DNI/CE: " value={representanteLegal.dni} />
                        </div>
                    )}
                </div>

                {/* COLUMNA 3: CONDUCTORES ASOCIADOS */}
                {/* 🌟 OPCIONAL: Si hay demasiados conductores, aquí sí agregamos un max-h y overflow-y-auto funcional */}
                <div className="flex w-full flex-col gap-4 bg-white p-6 rounded-lg shadow-md border border-slate-100 md:col-span-2 lg:col-span-1">
                    <h3 className="text-xl md:text-2xl font-bold text-[#026DCC] tracking-tight mb-2">
                        CONDUCTORES ASOCIADOS
                    </h3>

                    <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {conductores && conductores.length > 0 ? (
                            conductores.map((conductor, index) => (
                                <div key={index} className="border border-slate-200 p-4 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors">
                                    <PDetail content="NOMBRE COMPLETO: " value={conductor.nombre} />
                                    <div className="mt-1">
                                        <PDetail content="LICENCIA: " value={conductor.licencia} />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-slate-400 italic bg-slate-50 p-4 rounded-lg border border-dashed text-center">
                                No hay conductores asociados.
                            </p>
                        )}
                    </div>
                </div>

            </div>
        </Details>
    );
};

export default DetailTransportista;