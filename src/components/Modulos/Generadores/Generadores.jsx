import React from "react";
import { Column } from "primereact/column";
import axios from "../../api/axios";
import ListPrincipal from "../../ui/table/MainTable";
import OptionGlobal from "../../Modulos/Dashboard/Options";
import { useToast } from "../../notificaciones/ToastContext";
import DetailGenerador from "./Actions/Detail";

const Generadores = () => {
    const { showError } = useToast();

    const fetchGeneradoresData = async (page, limit, search) => {
        try {
            const response = await axios.get("/certificaciones/getGeneradoresPaginacion", {
                params: { limit, page, search },
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

    return (
        <OptionGlobal
            module="GENERADORES"
            entityName="Generador"
            ItemList={GeneradoresListWrapper}
            ItemRegister={() => <div className="p-5 text-gray-500">Módulo de registro en construcción...</div>}
            ItemReporte={() => <div className="p-5 text-gray-500">Módulo de reportes en construcción...</div>}
        />
    );
};

export default Generadores;