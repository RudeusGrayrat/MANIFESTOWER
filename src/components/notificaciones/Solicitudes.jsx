// components/Modulos/Certificaciones/ManifesTower/SolicitudesVinculacion.jsx
import React, { useState } from "react";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputSwitch } from "primereact/inputswitch";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useToast } from "./ToastContext";
import ListPrincipal from "../ui/table/MainTable";

const SolicitudesVinculacion = () => {
    const { user, activeRole } = useAuth();
    const { showSuccess, showError } = useToast();
    const [activeTab, setActiveTab] = useState("RECIBIDAS");
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const esGenerador = !!user?.generadorId;

    const obtenerContraparte = (rowData) => {
        const esMiIdGenerador = user?.generadorId === (rowData.generadorId?._id || rowData.generadorId);
        return esMiIdGenerador ? rowData.transportistaId : rowData.generadorId;
    };

    const fetchSolicitudesData = async (page, limit, search) => {
        if (!user) return { data: [], total: 0 };
        try {
            const params = { tipo: activeTab, search };
            if (user.generadorId) params.generadorId = user.generadorId;
            if (user.transportistaId) params.transportistaId = user.transportistaId;

            const response = await axios.get("/manifesTower/getSolicitudesVinculacion", { params });
            return {
                data: response.data?.data || [],
                total: response.data?.data?.length || 0
            };
        } catch (error) {
            console.error("Error al cargar solicitudes:", error);
            showError("No se pudieron obtener las solicitudes.");
            return { data: [], total: 0 };
        }
    };

    const handleCancelarEnlace = async (rowData) => {
        try {
            const response = await axios.patch(`/manifesTower/patchVinculacion/${rowData._id}`, null, {
                params: { accion: "CANCELAR", usuarioId: user?._id }
            });
            showSuccess("Vinculación comercial cancelada y removida.");
            setRefreshTrigger(prev => prev + 1);
        } catch (error) {
            console.error(error);
            showError("Error al cancelar la vinculación.");
        }
    };

    const empresaTemplate = (rowData) => {
        const contraparte = obtenerContraparte(rowData);
        const esContraparteTransportista = rowData.transportistaId?._id === contraparte?._id;
        return (
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg text-slate-600 ${esContraparteTransportista ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"}`}>
                    <span className={`pi ${esContraparteTransportista ? "pi-truck" : "pi-building"} text-md`}></span>
                </div>
                <div>
                    <span className="font-semibold text-slate-800 block line-clamp-1">
                        {contraparte?.razonSocial || "Empresa no especificada"}
                    </span>
                    <span className="text-xs font-mono text-slate-400 bg-slate-50 px-1 py-0.5 rounded border border-slate-100">
                        RUC {contraparte?.ruc || "----------"}
                    </span>
                </div>
            </div>
        );
    };

    const estadoTemplate = (rowData) => {
        const esDesvinculado = !!(rowData.fechaDesvinculacion || rowData.desvinculadoPor);
        const configRechazada = "text-rose-600 bg-rose-50 border-rose-200";
        const config = {
            PENDIENTE: "text-amber-600 bg-amber-50 border-amber-200",
            ACEPTADA: "text-green-600 bg-green-50 border-green-200",
            RECHAZADA: "text-rose-600 bg-rose-50 border-rose-200"
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium border shadow-xs ${esDesvinculado ? configRechazada : config[rowData.status] || "text-slate-500 bg-slate-50"}`}>
                {esDesvinculado ? "DESVINCULADO" : rowData.status}
            </span>
        );
    };

    const ApproveModal = ({ setShowApprove, selected, reload }) => {
        const [submitting, setSubmitting] = useState(false);
        const [permisoLlenado, setPermisoLlenado] = useState(false);
        const [showInfoPermiso, setShowInfoPermiso] = useState(false);
        const contraparte = obtenerContraparte(selected);

        const handleConfirm = async () => {
            setSubmitting(true);
            try {
                const response = await axios.patch(`/manifesTower/patchVinculacion/${selected._id}`, null, {
                    params: {
                        accion: "ACEPTAR",
                        transportistaId: selected.transportistaId?._id || selected.transportistaId,
                        usuarioId: user?._id,
                        rolActivo: activeRole,
                        tienePermisoLlenado: permisoLlenado
                    }
                });
                showSuccess(response.data?.message || "Vinculación establecida con éxito.");
                reload();
                setShowApprove(false);
            } catch (error) {
                console.error(error);
                showError(error.response?.data?.message || "Error al procesar la aprobación.");
            } finally {
                setSubmitting(false);
            }
        };

        return (
            <Dialog
                visible={true}
                onHide={() => setShowApprove(false)}
                header="Confirmar Enlace Comercial"
                modal
                className="w-11/12 max-w-md"
                footer={
                    <div className="flex justify-end gap-2 mt-4">
                        <Button label="Cancelar" className="p-button-text text-slate-500!" onClick={() => setShowApprove(false)} disabled={submitting} />
                        <Button label="Aceptar e Interconectar" icon={submitting ? "pi pi-spin pi-spinner" : "pi pi-check"} className="bg-green-600! border-green-600!" onClick={handleConfirm} disabled={submitting} />
                    </div>
                }
            >
                <div className="text-sm text-slate-600 leading-relaxed flex flex-col gap-4">
                    <p>
                        ¿Estás seguro de que deseas **aceptar** la solicitud de vinculación con{" "}
                        <span className="font-bold text-slate-900">{contraparte?.razonSocial}</span>?
                    </p>

                    {esGenerador && (
                        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl mt-2 flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <span className="font-semibold text-slate-800 text-xs">Autorizar uso de mis datos</span>
                                <div className="flex items-center gap-2">
                                    <Button
                                        type="button"
                                        icon="pi pi-info-circle"
                                        rounded
                                        text
                                        severity="info"
                                        className="w-8 h-8 text-[#285598]!"
                                        onClick={() => setShowInfoPermiso((prev) => !prev)}
                                        aria-label="Ver información del permiso"
                                    />
                                    <InputSwitch checked={permisoLlenado} onChange={(e) => setPermisoLlenado(e.value)} />
                                </div>
                            </div>
                            {showInfoPermiso && (
                                <div className="p-3 rounded-lg border border-blue-100 bg-blue-50 text-xs text-blue-700 leading-relaxed">
                                    Este permiso permite que la empresa vinculada use tus datos fiscales y operativos para generar manifiestos de forma automática.
                                </div>
                            )}
                            <p className="text-xs text-slate-400">
                                Si lo activas, esta empresa de transporte podrá utilizar tu información fiscal y operativa para la autogeneración de manifiestos.
                            </p>
                        </div>
                    )}
                </div>
            </Dialog>
        );
    };

    const DisapproveModal = ({ setShowDisapprove, selected, reload }) => {
        const [submitting, setSubmitting] = useState(false);
        const contraparte = obtenerContraparte(selected);

        const handleConfirm = async () => {
            setSubmitting(true);
            try {
                const response = await axios.patch(`/manifesTower/patchVinculacion/${selected._id}`, null, {
                    params: {
                        accion: "RECHAZAR",
                        transportistaId: selected.transportistaId?._id || selected.transportistaId,
                        usuarioId: user?._id
                    }
                });
                showSuccess(response.data?.message || "Solicitud declinada.");
                reload();
                setShowDisapprove(false);
            } catch (error) {
                console.error(error);
                showError(error.response?.data?.message || "Error al denegar la solicitud.");
            } finally {
                setSubmitting(false);
            }
        };

        return (
            <Dialog
                visible={true}
                onHide={() => setShowDisapprove(false)}
                header="Declinar Solicitud"
                modal
                className="w-11/12 max-w-md"
                footer={
                    <div className="flex justify-end gap-2 mt-4">
                        <Button label="Volver" className="p-button-text text-slate-500!" onClick={() => setShowDisapprove(false)} disabled={submitting} />
                        <Button label="Rechazar" icon={submitting ? "pi pi-spin pi-spinner" : "pi pi-times"} className="bg-rose-600! border-rose-600!" onClick={handleConfirm} disabled={submitting} />
                    </div>
                }
            >
                <p className="text-sm text-slate-600 leading-relaxed">
                    ¿Deseas **rechazar** la propuesta de enlace de{" "}
                    <span className="font-bold text-slate-900">{contraparte?.razonSocial}</span>?
                </p>
            </Dialog>
        );
    };

    return (
        <div className="p-6 bg-white rounded-xl border border-slate-100 shadow-xs">
            <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-4">
                <div>
                    <h3 className="text-lg font-bold text-slate-800 tracking-tight">Centro de Vinculaciones B2B</h3>
                    <p className="text-sm text-slate-500 mt-0.5">
                        {esGenerador
                            ? "Gestiona conexiones operativas con tus empresas de transporte aliadas y otorga permisos de datos."
                            : "Administra enlaces con tus clientes generadores de carga para la emisión de manifiestos."
                        }
                    </p>
                </div>

                <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200 shadow-inner w-full md:w-auto">
                    <button
                        onClick={() => setActiveTab("RECIBIDAS")}
                        className={`flex-1 md:flex-initial px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-150 flex items-center justify-center gap-2 ${activeTab === "RECIBIDAS" ? "bg-white text-[#285598] shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
                    >
                        <i className="pi pi-download text-xs"></i> Solicitudes Recibidas
                    </button>
                    <button
                        onClick={() => setActiveTab("ENVIADAS")}
                        className={`flex-1 md:flex-initial px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-150 flex items-center justify-center gap-2 ${activeTab === "ENVIADAS" ? "bg-white text-[#285598] shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
                    >
                        <i className="pi pi-upload text-xs"></i> Solicitudes Enviadas
                    </button>
                </div>
            </div>

            <ListPrincipal
                key={`${activeTab}_${refreshTrigger}`}
                fetchData={fetchSolicitudesData}
                permissionApprove={activeTab === "RECIBIDAS"}
                permissionDisapprove={activeTab === "RECIBIDAS"}
                ApproveItem={ApproveModal}
                DisapproveItem={DisapproveModal}
            >
                <Column header="Empresa Asociada" body={empresaTemplate} style={{ minWidth: "240px" }} />
                <Column header="Tipo Contraparte" body={(row) => {
                    const contraparte = obtenerContraparte(row);
                    const esContraparteTransportista = row.transportistaId?._id === contraparte?._id;
                    return (
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${esContraparteTransportista ? "bg-blue-50 text-blue-700" : "bg-purple-50 text-purple-700"}`}>
                            {esContraparteTransportista ? "TRANSPORTISTA" : "GENERADOR"}
                        </span>
                    );
                }} />
                <Column header="Fecha Solicitud" body={(row) => <span className="text-sm text-slate-600">{new Date(row.createdAt).toLocaleDateString()}</span>} />
                <Column header="Estado" body={estadoTemplate} />
            </ListPrincipal>
        </div>
    );
};

export default SolicitudesVinculacion;