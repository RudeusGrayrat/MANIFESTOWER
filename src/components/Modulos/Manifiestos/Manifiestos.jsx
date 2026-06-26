import React from "react";
import { Column } from "primereact/column";
import axios from "../../api/axios";
import ListPrincipal from "../../ui/table/MainTable";
import RegisterManifiestos from "./Register/Register";
import OptionGlobal from "../../Modulos/Dashboard/Options";
import { useToast } from "../../notificaciones/ToastContext";
import DetailManifiesto from "./Actions/Detail";
import { useAuth } from "../../context/AuthContext";

const Manifiestos = () => {
    const { showError, showSuccess } = useToast();
    const { user } = useAuth()

    const fetchManifiestosData = async (page, limit, search) => {
        try {
            if (!user?._id) {
                return { data: [], total: 0 };
            }

            const params = { page, limit, search, usuario: user?._id };
            const response = await axios.get("/certificaciones/getManifiestosPaginacion", { params });

            // Ejemplo opcional de éxito discreto si quieres:
            // showSuccess("Datos sincronizados."); 

            return {
                data: response.data.data || [],
                total: response.data.total || 0
            };
        } catch (error) {
            // 🌟 Mandamos una alerta flotante de error global de forma inmediata si se cae el servidor
            showError("No se pudieron cargar los manifiestos desde el servidor.");
            console.error("Error fetching manifiestos:", error);
            return { data: [], total: 0 };
        }
    };

    // Sub-componente interno para la Lista (recibe los permisos distribuidos de OptionGlobal automáticamente)
    const ManifiestosListWrapper = (props) => {
        return (
            <ListPrincipal
                {...props} // Inyecta dinámicamente todos los permisos concedidos
                fetchData={fetchManifiestosData}
                DetailItem={DetailManifiesto}
            >
                <Column field="numeroManifiesto" header="N° Manifiesto" />
                <Column
                    field="generadorId"
                    header="Generador"
                    body={(rowData) => rowData.generadorId?.razonSocial || "N/A"}
                />
                <Column field="residuo.descripcion" header="Residuo" />
                <Column
                    field="transporte.fechaRecepcion"
                    header="Fecha Recepción"
                    body={(row) => row.transporte?.fechaRecepcion ? new Date(row.transporte.fechaRecepcion).toLocaleDateString() : "-"}
                />
                <Column
                    field="createdAt"
                    header="Fecha Registro"
                    body={(row) => new Date(row.createdAt).toLocaleDateString()}
                />
                <Column
                    field="estado"
                    header="Estado"
                    body={(rowData) => {
                        let color = "text-gray-500";
                        switch (rowData.estado) {
                            case "PENDIENTE": color = "text-yellow-500"; break;
                            case "RECHAZADO": color = "text-red-500"; break;
                            case "APROBADO": color = "text-green-500"; break;
                            case "OBSERVADO": color = "text-orange-500"; break;
                            case "ENVIADO": color = "text-blue-500"; break;
                            case "EN REVISION": color = "text-purple-500"; break;
                            default: break;
                        }
                        return (
                            <div className={`text-center bg-gradient-to-tr from-white to-gray-50 shadow-inner rounded-lg font-medium px-4 py-1 ${color}`}>
                                {rowData.estado}
                            </div>
                        );
                    }}
                />
            </ListPrincipal>
        );
    };

    return (
        <OptionGlobal
            module="MANIFIESTOS"
            entityName="Manifiesto"
            ItemList={ManifiestosListWrapper}
            ItemRegister={() => <RegisterManifiestos />}
            ItemReporte={() => <div className="p-5 text-gray-500">Módulo de reportes en construcción...</div>}
        />
    );
};

export default Manifiestos;