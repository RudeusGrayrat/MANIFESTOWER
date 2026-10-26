// components/Modulos/Certificaciones/ManifesTower/Transportistas.jsx
import React, { useState } from "react";
import { Column } from "primereact/column";
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
    const { user } = useAuth();
    const [refreshKey, setRefreshKey] = useState(0);

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
