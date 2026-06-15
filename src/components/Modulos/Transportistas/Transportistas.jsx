import React from "react";
import { Column } from "primereact/column";
import axios from "../../api/axios";
import ListPrincipal from "../../ui/table/MainTable";
import OptionGlobal from "../../Modulos/Dashboard/Options";
import { useToast } from "../../notificaciones/ToastContext";
import DetailTransportista from "./Actions/Details";
import AddTransportista from "./Register/AddTransportista";

const Transportistas = () => {
    const { showError } = useToast();

    const fetchTransportistasData = async (page, limit, search) => {
        try {
            const response = await axios.get("/certificaciones/getTransportistasPaginacion", {
                params: { limit, page, search },
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

    const TransportistasListWrapper = (props) => {
        return (
            <ListPrincipal
                {...props}
                fetchData={fetchTransportistasData}
                DetailItem={DetailTransportista}
            >
                {/* 🌟 Columnas corregidas para representar una Empresa Transportista real */}
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
            module="TRANSPORTISTAS"
            entityName="Transportista"
            ItemList={TransportistasListWrapper}
            ItemRegister={AddTransportista}
            ItemReporte={() => <div className="p-5 text-gray-500">Módulo de reportes en construcción...</div>}
        />
    );
};

export default Transportistas;