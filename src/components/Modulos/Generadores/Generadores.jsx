import React from "react";
import { Column } from "primereact/column";
import axios from "../../api/axios";
import ListPrincipal from "../../ui/table/MainTable";
import OptionGlobal from "../../Modulos/Dashboard/Options";
import { useToast } from "../../notificaciones/ToastContext";
import DetailGenerador from "./Actions/Detail";
import { useAuth } from "../../context/AuthContext";
import AddGenerador from "./Register/AddGenerador";
import SolicitudesVinculacion from "../../notificaciones/Solicitudes";

const Generadores = () => {
    const { showError } = useToast();
    const { user } = useAuth();
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

    const GeneradoresListWrapper = (props) => {
        return (
            <ListPrincipal
                {...props}
                fetchData={fetchGeneradoresData}
                DetailItem={DetailGenerador || (() => <div>Detalle no disponible</div>)}
            >
                <Column field="ruc" header="RUC / Identificación" />
                <Column field="razonSocial" header="Razón Social" />
                <Column field="direccionFiscal" header="Dirección Fiscal" body={(row) => row.direccionFiscal || "-"} />
                <Column field="contacto.nombre" header="Contacto" body={(row) => row.contacto?.nombre || "-"} />
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
    const SolicitudesGeneradoresWrapper = () => {
        return (
            <div className="p-6 bg-white rounded-xl shadow-xs border border-slate-100">
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Solicitudes de Vinculación Recibidas</h3>
                <p className="text-sm text-slate-500 mb-4">
                    Revisa y gestiona las invitaciones de Generadores que desean contratar tus unidades de transporte.
                </p>
                {/* Aquí pondrás la lógica de botones de [Aceptar] o [Rechazar] */}
                <div className="p-10 border border-dashed border-slate-200 rounded-xl text-center text-slate-400">
                    <i className="pi pi-bell text-3xl mb-2 block"></i>
                    Bandeja de entrada de solicitudes de clientes listas para Procesar (Aceptar/Rechazar)
                </div>
            </div>
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