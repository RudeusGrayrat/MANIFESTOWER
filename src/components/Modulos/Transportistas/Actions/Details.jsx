// src/Modules/Certificación/Manifiestos/Permissions/Detail.jsx
import { useEffect, useState } from "react";
import { useToast } from "../../../notificaciones/ToastContext";
import axios from "../../../api/axios";
import Details from "../../../ui/Permissions/Detail";
import PDetail from "../../../ui/cards/PDetail";

const DetailTransportista = ({ setShowDetail, selected }) => {
    const { showError } = useToast();
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
    if (!selected) {
        showError("No se ha seleccionado ningún transportista para mostrar los detalles.");
        return null;
    }

    return (
        <Details setShowDetail={setShowDetail} title={`Manifiesto ${selected?.numeroManifiesto || ''}`}>
            <div className="flex flex-wrap justify-around gap-y-8 gap-x-10">
                <div className="flex flex-col gap-8 bg-white p-6 rounded-lg shadow-md">
                    {/* DATOS DEL TRANSPORTISTA */}
                    <div className="flex flex-col gap-2">
                        <h3 className="text-3xl font-bold text-[#026DCC]">DATOS DEL TRANSPORTISTA</h3>
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
                        <div className="flex flex-col">
                            <h3 className="text-3xl font-bold text-[#026DCC]">RESPONSABLE TÉCNICO</h3>
                            <PDetail content="NOMBRE: " value={responsableTecnico.nombre} />
                            <PDetail content="N° COLEGIATURA: " value={responsableTecnico.numeroColegiatura} />
                        </div>
                    )}
                </div>

                {/* UBICACIÓN Y REPRESENTANTE LEGAL */}
                <div className="flex flex-col gap-8 bg-white p-6 rounded-lg shadow-md">
                    <div className="flex flex-col">
                        <h3 className="text-3xl font-bold text-[#026DCC]">CONTINGENCIAS</h3>
                        <PDetail content="DERRAME: " value={contingencias?.derrame || "No especificado"} />
                        <PDetail content="INFILTRACIÓN: " value={contingencias?.infiltracion || "No especificado"} />
                        <PDetail content="INCENDIO: " value={contingencias?.incendio || "No especificado"} />
                        <PDetail content="EXPLOSIÓN: " value={contingencias?.explosion || "No especificado"} />
                        <PDetail content="OTROS ACCIDENTES: " value={contingencias?.otros || "No especificado"} />
                    </div>
                    <div className="flex flex-col">
                        <h3 className="text-2xl font-bold text-[#026DCC]">UBICACIÓN</h3>
                        <PDetail content="UBIGEO: " value={ubigeoId?.codigo} />
                        <PDetail content="DEPARTAMENTO: " value={ubigeoId?.departamento} />
                        <PDetail content="PROVINCIA: " value={ubigeoId?.provincia} />
                        <PDetail content="DISTRITO: " value={ubigeoId?.distrito} />
                    </div>
                    {(representanteLegal && generadores?.length > 0) && (
                        <div className="flex flex-col">
                            <h3 className="text-3xl font-bold text-[#026DCC]">REPRESENTANTE LEGAL</h3>
                            <PDetail content="NOMBRE: " value={representanteLegal.nombre} />
                            <PDetail content="DNI/CE: " value={representanteLegal.dni} />
                        </div>
                    )}

                </div>

                <div className="flex flex-col gap-8 bg-white p-6 rounded-lg shadow-md">
                    {(generadores?.length === 0 && responsableTecnico) && (
                        <div className="flex flex-col">
                            <h3 className="text-3xl font-bold text-[#026DCC]">RESPONSABLE TÉCNICO</h3>
                            <PDetail content="NOMBRE: " value={responsableTecnico.nombre} />
                            <PDetail content="N° COLEGIATURA: " value={responsableTecnico.numeroColegiatura} />
                        </div>
                    )}
                    {(representanteLegal && generadores?.length === 0) && (
                        <div className="flex flex-col">
                            <h3 className="text-3xl font-bold text-[#026DCC]">REPRESENTANTE LEGAL</h3>
                            <PDetail content="NOMBRE: " value={representanteLegal.nombre} />
                            <PDetail content="DNI/CE: " value={representanteLegal.dni} />
                        </div>
                    )}

                    {generadores && generadores?.length > 0 && (
                        <div className="flex flex-col">
                            <h3 className="text-3xl font-bold text-[#026DCC]">GENERADORES ASOCIADOS</h3>
                            {generadores.map((gen, index) => (
                                <div key={index} className="border p-3 rounded-lg">
                                    <PDetail content="RAZÓN SOCIAL: " value={gen.razonSocial} />
                                    <PDetail content="RUC: " value={gen.ruc} />
                                </div>
                            ))}
                        </div>
                    )}
                    {conductores && conductores?.length > 0 && (
                        <div className="flex flex-col">
                            <h3 className="text-3xl font-bold text-[#026DCC]">CONDUCTORES ASOCIADOS</h3>
                            {conductores.map((conductor, index) => (
                                <div key={index} className="border p-3 rounded-lg">
                                    <PDetail content="NOMBRE COMPLETO: " value={conductor.nombre} />
                                    <PDetail content="LICENCIA: " value={conductor.licencia} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Details>
    );
};

export default DetailTransportista