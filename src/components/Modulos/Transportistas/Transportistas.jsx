// components/Modulos/Certificaciones/ManifesTower/Transportistas.jsx
import React, { useState } from "react";
import { Column } from "primereact/column";
import { InputSwitch } from "primereact/inputswitch";
import axios from "../../api/axios";
import ListPrincipal from "../../ui/table/MainTable";
import OptionGlobal from "../../Modulos/Dashboard/Options";
import { useToast } from "../../notificaciones/ToastContext";
import DetailTransportista from "./Actions/Details";
import AddTransportista from "./Register/AddTransportista";
import { useAuth } from "../../context/AuthContext";
import SolicitudesVinculacion from "../../notificaciones/Solicitudes";
import ConfirmDesvinculacionModal from "../../notificaciones/Desvinculacion";

const Transportistas = () => {
    const { showError, showSuccess } = useToast();
    const { user, activeRole } = useAuth();
    const [refreshKey, setRefreshKey] = useState(0);
    const [loadingPermiso, setLoadingPermiso] = useState(null);
    const esGenerador = !!user?.generadorId;

    const fetchTransportistasData = async (page, limit, search) => {
        if (!user?._id) {
            return { data: [], total: 0 };
        }

        try {
            const response = await axios.get("/certificaciones/getTransportistasPaginacion", {
                params: { limit, page, search, usuario: user?._id },
            });
            return {
                data: response.data.data || [],
                total: response.data.total || 0,
            };
        } catch (error) {
            showError("No se pudieron cargar los Transportistas desde el servidor.");
            console.error("Error fetching Transportistas:", error);
            return { data: [], total: 0 };
        }
    };

    const handleTogglePermiso = async (rowData, newValue) => {
        setLoadingPermiso(rowData._id);
        const generadorId = user?.generadorId?._id || user?.generadorId;
        try {

            const response = await axios.patch(`/manifesTower/patchVinculacion/${rowData._id}`, null, {
                params: {
                    accion: "TOGGLE_PERMISO",
                    usuarioId: user?._id,
                    rolActivo: activeRole,
                    tienePermisoLlenado: newValue,
                    transportistaId: rowData._id,
                    generadorId: generadorId
                }
            });

            showSuccess(response.data?.message || `Llenado automático ${newValue ? "permitido" : "revocado"} para este transportista.`);
            setRefreshKey(prev => prev + 1);
        } catch (error) {
            console.error("Error al actualizar permiso de llenado:", error);
            showError(error.response?.data?.message || "No se pudo actualizar el permiso de llenado automático.");
        } finally {
            setLoadingPermiso(null);
        }
    };

    const permisosTemplate = (rowData) => {
        const esDesvinculado = rowData.estado === "INACTIVO" || rowData.estado === "SUSPENDIDO";

        // Extrae el permiso buscando la coincidencia exacta de este generador dentro de la lista que posee el transportista
        const miGeneradorId = user?.generadorId?._id || user?.generadorId;
        const relacionGenerador = rowData.generadores?.find(g => (g.generadorId?._id || g.generadorId) === miGeneradorId);
        const tienePermiso = rowData.tienePermisoLlenado !== undefined ? rowData.tienePermisoLlenado : (relacionGenerador?.tienePermisoLlenado || false);

        if (esGenerador) {
            return (
                <div className="flex items-center gap-3">
                    <InputSwitch
                        disabled={esDesvinculado || loadingPermiso === rowData._id}
                        checked={tienePermiso}
                        onChange={(e) => handleTogglePermiso(rowData, e.value)}
                    />
                    <span className={`text-xs font-medium transition-colors duration-150 ${tienePermiso ? "text-green-600 font-semibold" : "text-slate-400"}`}>
                        {tienePermiso ? "Autorizado" : "Restringido"}
                    </span>
                </div>
            );
        } else {
            return (
                <span className={`text-xs font-semibold px-2 py-1 rounded ${tienePermiso ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {tienePermiso ? "Permiso Concedido" : "Sin Autorización"}
                </span>
            );
        }
    };

    const DesvincularModalWrapper = ({ setShowDelete, selected, reload }) => {
        const [loading, setLoading] = useState(false);

        const handleConfirm = async () => {
            setLoading(true);
            const transportistaId = selected._id;
            const generadorId = user?.generadorId || "CORE";
            const usuarioId = user?._id;
            const rolActivo = "GENERADOR";

            try {
                console.log("Iniciando desvinculación para:", selected);
                const response = await axios.patch("/manifesTower/desvinculacion", null, {
                    params: { transportistaId, generadorId, usuarioId, rolActivo }
                });

                if (response.status === 200) {
                    showSuccess("Desvinculación completada con éxito.");
                    reload();
                    setShowDelete(false);
                }
            } catch (error) {
                console.error("Error al desvincular:", error);
                showError(error.response?.data?.message || "Error interno al procesar la desvinculación.");
            } finally {
                setLoading(false);
            }
        };

        return (
            <ConfirmDesvinculacionModal
                visible={true}
                onHide={() => setShowDelete(false)}
                onConfirm={handleConfirm}
                rowData={selected}
                loading={loading}
            />
        );
    };

    const TransportistasListWrapper = (props) => {
        return (
            <ListPrincipal
                {...props}
                key={refreshKey}
                fetchData={fetchTransportistasData}
                permissionDelete={true}
                DeleteItem={DesvincularModalWrapper}
                DetailItem={DetailTransportista}
                mobileTitle={(row) => row.razonSocial || "Transportista"}
                mobileFields={[
                    { label: "RUC", field: "ruc" },
                    { label: "Registro EORS", field: "registroEors" },
                    { label: "Dirección", field: "direccion" },
                    { label: "Estado", value: (row) => row.estado || "ACTIVO" },
                ]}
            >
                <Column field="ruc" header="RUC / Identificación" className="font-mono text-sm text-slate-600" />
                <Column field="razonSocial" header="Razón Social" className="font-semibold text-slate-800" />
                <Column field="direccion" header="Dirección" className="text-slate-500 text-sm" />
                <Column field="registroEors" header="Registro EORS" className="text-slate-600 text-sm" />

                {/* 🔳 Switch de Permiso de Llenado unificado */}
                <Column header="Autorización de Llenado" body={permisosTemplate} />

                <Column
                    field="createdAt"
                    header="Fecha Registro"
                    body={(row) => <span className="text-sm text-slate-600">{new Date(row.createdAt).toLocaleDateString()}</span>}
                />

                <Column
                    field="estado"
                    header="Estado"
                    body={(rowData) => {
                        const esActivo = rowData.estado === "ACTIVO" || !rowData.estado;
                        const statusStyles = esActivo
                            ? "text-green-600 bg-green-50 border-green-200"
                            : "text-rose-600 bg-rose-50 border-rose-200";
                        return (
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border shadow-xs inline-block text-center ${statusStyles}`}>
                                {rowData.estado || "ACTIVO"}
                            </span>
                        );
                    }}
                />
            </ListPrincipal>
        );
    };

    return (
        <OptionGlobal
            module="TRANSPORTISTAS"
            entityName="Transportista"
            ItemList={TransportistasListWrapper}
            ItemRegister={AddTransportista}
            ItemReporte={() => <div className="p-5 text-gray-500">Módulo de reportes en construcción...</div>}
            ItemSolicitudes={SolicitudesVinculacion}
        />
    );
};

export default Transportistas;
