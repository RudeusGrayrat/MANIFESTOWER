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

    // 🌟 Wrapper que adaptará tu modal personalizado al estándar de MainTable
    const DesvincularModalWrapper = ({ setShowDelete, selected, reload }) => {
        const [loading, setLoading] = useState(false);

        const handleConfirm = async () => {
            setLoading(true);

            // Mapeo correcto utilizando el prop "selected" que MainTable le inyecta automáticamente
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
                    reload(); // Recarga los datos de la tabla de forma fluida
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
                onHide={() => setShowDelete(false)} // Cierra usando la función nativa de MainTable
                onConfirm={handleConfirm}
                rowData={selected} // "selected" contiene la fila actual de la tabla
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
            >
                <Column field="ruc" header="RUC / Identificación" />
                <Column field="razonSocial" header="Razón Social" />
                <Column field="contacto.telefono" header="Teléfono" body={(row) => row.contacto?.telefono || "-"} />
                <Column field="contacto.correo" header="Correo" body={(row) => row.contacto?.correo || "-"} />
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
                            <div className={`text-center bg-linear-to-tr from-white to-gray-50 shadow-inner rounded-lg font-medium px-4 py-1 ${statusColor}`}>
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