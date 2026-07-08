import React, { useState } from "react";
import { Column } from "primereact/column";
import axios from "../../api/axios";
import ListPrincipal from "../../ui/table/MainTable";
import OptionGlobal from "../../Modulos/Dashboard/Options";
import { useToast } from "../../notificaciones/ToastContext";
import DetailGenerador from "./Actions/Detail";
import { useAuth } from "../../context/AuthContext";
import AddGenerador from "./Register/AddGenerador";
import SolicitudesVinculacion from "../../notificaciones/Solicitudes";
import ConfirmDesvinculacionModal from "../../notificaciones/Desvinculacion";

const Generadores = () => {
    const { showError, showSuccess } = useToast();
    const { user } = useAuth();
    const [refreshKey, setRefreshKey] = useState(0);

    const fetchGeneradoresData = async (page, limit, search) => {
        try {
            if (!user?._id) {
                return { data: [], total: 0 };
            }
            const response = await axios.get("/certificaciones/getGeneradoresPaginacion", {
                params: { limit, page, search, usuario: user?._id },
            });
            return {
                data: response.data.data || [],
                total: response.data.total || 0,
            };
        } catch (error) {
            showError("No se pudieron cargar los Generadores desde el servidor.");
            console.error("Error fetching Generadores:", error);
            return { data: [], total: 0 };
        }
    };

    // 🌟 Wrapper adaptado para el rol TRANSPORTISTA desvinculando un GENERADOR
    const DesvincularModalWrapper = ({ setShowDelete, selected, reload }) => {
        const [loading, setLoading] = useState(false);

        const handleConfirm = async () => {
            setLoading(true);

            // Mapeo invertido correspondiente al rol de Transportista
            const transportistaId = user?.transportistaId || "CORE";
            const generadorId = selected._id; // La fila es el Generador
            const usuarioId = user?._id;
            const rolActivo = "TRANSPORTISTA";

            try {
                console.log("Iniciando desvinculación desde Transportista para:", selected);
                const response = await axios.patch("/manifesTower/desvinculacion", null, {
                    params: { transportistaId, generadorId, usuarioId, rolActivo }
                });

                if (response.status === 200) {
                    showSuccess("Desvinculación completada con éxito.");
                    reload(); // Recarga la tabla de forma limpia
                    setShowDelete(false); // Cierra el modal
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

    const GeneradoresListWrapper = (props) => {
        return (
            <ListPrincipal
                {...props}
                key={refreshKey}
                fetchData={fetchGeneradoresData}
                permissionDelete={true} // 🌟 Habilitamos el botón de eliminación en las acciones
                DeleteItem={DesvincularModalWrapper} // 🌟 Pasamos nuestro puente del modal
                DetailItem={DetailGenerador || (() => <div>Detalle no disponible</div>)}
            >
                <Column field="ruc" header="RUC / Identificación" />
                <Column field="razonSocial" header="Razón Social" />
                <Column field="representanteLegal" header="Representante Legal" />
                <Column field="correoElectronico" header="Correo" />
                <Column
                    field="createdAt"
                    header="Fecha Registro"
                    body={(row) => new Date(row.createdAt).toLocaleDateString()}
                />
                <Column
                    field="estado"
                    header="Estado"
                    body={(rowData) => {
                        const statusColor = rowData.estado === "ACTIVO" ? "text-green-500" : "text-red-500";
                        return (
                            <div className={`text-center bg-gradient-to-tr from-white to-gray-50 shadow-inner rounded-lg font-medium px-4 py-1 ${statusColor}`}>
                                {rowData.estado || "ACTIVO"}
                            </div>
                        );
                    }}
                />
            </ListPrincipal>
        );
    };

    return (
        <OptionGlobal
            module="GENERADORES"
            entityName="Generador"
            ItemList={GeneradoresListWrapper}
            ItemRegister={AddGenerador}
            ItemReporte={() => <div className="p-5 text-gray-500">Módulo de reportes en construcción...</div>}
            ItemSolicitudes={SolicitudesVinculacion}
        />
    );
};

export default Generadores;