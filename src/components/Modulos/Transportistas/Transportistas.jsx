import React, { useState } from "react";
import { Column } from "primereact/column";
import { Button } from "primereact/button"; // 🌟 Importamos el botón de PrimeReact
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
    const [desvincularId, setDesvincularId] = useState(false);
    const { user } = useAuth();
    const [refreshKey, setRefreshKey] = useState(0);
    const [showDesvinculationModal, setShowDesvinculationModal] = useState(false);

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

    // 🌟 Función para romper el vínculo operacional en caliente
    const handleDesvincular = async (rowData) => {
        setDesvincularId(true)
        setShowDesvinculationModal(true);
        // const idVinculacion = rowData.vinculacionId; // El backend debe proveer este ID en el paginado

        // if (!idVinculacion) {
        //     showError("No se encontró el identificador de la vinculación para realizar esta acción.");
        //     return;
        // }

        // if (!window.confirm(`¿Estás seguro de que deseas desvincularte de la empresa ${rowData.razonSocial}?`)) {
        //     return;
        // }

        try {
            //     const response = await axios.patch(`/certificaciones/responderSolicitud/${idVinculacion}`, null, {
            //         params: {
            //             accion: 'CANCELAR',
            //             usuarioId: user?._id,
            //             rolActivo: 'GENERADOR' // Ajustar dinámicamente si el usuario maneja múltiples roles
            //         }
            //     });

            //     if (response.status === 200) {
            //         showSuccess("Desvinculación completada con éxito.");
            //         setRefreshKey(prev => prev + 1); // Forzamos la recarga de datos en la tabla
            //     }
            console.log("Desvinculación simulada para:", rowData);
        } catch (error) {
            console.error("Error al desvincular:", error);
            showError(error.response?.data?.message || "Error interno al procesar la desvinculación.");
        } finally {
            setDesvincularId(false); // Reseteamos el estado de desvinculación
        }
    };

    const TransportistasListWrapper = (props) => {
        return (
            <ListPrincipal
                {...props}
                key={refreshKey} // 🌟 El key obliga al componente a remontarse y pedir datos frescos al eliminar
                fetchData={fetchTransportistasData}
                actionBody={
                    <Button icon="pi pi-times "
                        title="Desvincular" rounded outlined
                        className={`text-red-600 rounded-full mx-1! bg-[#f7f6f6bb] transition-all duration-150 ease-in-out  ${desvincularId ? "shadow-inner translate-y-[2px]" : "shadow-xl! "}`}
                        severity="danger"
                        onClick={() => setShowDesvinculationModal(true)}
                        disabled={desvincularId}
                    />

                }
                DetailItem={DetailTransportista}
            >
                {showDesvinculationModal && (
                    <ConfirmDesvinculacionModal
                        visible={showDesvinculationModal}
                        onHide={() => setShowDesvinculationModal(false)}
                        onConfirm={(rowData) => handleDesvincular(rowData)}
                        rowData={(rowData) => rowData}
                        loading={desvincularId}
                    />
                )}
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