// components/Modulos/Certificaciones/ManifesTower/Manifiestos.jsx
import React, { useState } from "react";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import axios from "../../api/axios";
import ListPrincipal from "../../ui/table/MainTable";
import RegisterManifiestos from "./Register/Register";
import OptionGlobal from "../Dashboard/Options";
import { useToast } from "../../notificaciones/ToastContext";
import DetailManifiesto from "./Actions/Detail";
import { useAuth } from "../../context/AuthContext";
import EditManifiesto from "./Actions/Edit";
import SendManifiesto from "./Actions/SendManifiesto";
import ApproveManifiestoModal from "./Actions/ApproveManifiesto"

const Manifiestos = () => {
    const { showError } = useToast();
    const { user, activeRole } = useAuth();
    const [refreshKey, setRefreshKey] = useState(0); // 👈 Estado controlador de recarga

    const fetchManifiestosData = async (page, limit, search) => {
        try {
            if (!user?._id) {
                return { data: [], total: 0 };
            }
            const params = { page, limit, search, usuario: user?._id, rolActivo: activeRole };
            const response = await axios.get("/certificaciones/getManifiestosPaginacion", { params });

            return {
                data: response.data.data || [],
                total: response.data.total || 0
            };
        } catch (error) {
            showError("No se pudieron cargar los manifiestos desde el servidor.");
            console.error("Error fetching manifiestos:", error);
            return { data: [], total: 0 };
        }
    };

    // Sub-componente interno para la Lista
    const ManifiestosListWrapper = (props) => {
        const [showApproveModal, setShowApproveModal] = useState(false);
        const [selectedItem, setSelectedItem] = useState(null);

        return (
            <>
                <ListPrincipal
                    {...props}
                    key={refreshKey} // 👈 Vinculado al refreshKey
                    fetchData={fetchManifiestosData}
                    DetailItem={DetailManifiesto}
                    EditItem={EditManifiesto}
                    EnviarItem={SendManifiesto}
                    mobileTitle={(row) => `Manifiesto ${row.numeroManifiesto || "sin número"}`}
                    mobileFields={[
                        { label: "Generador", value: (row) => row.generadorId?.razonSocial || "N/A" },
                        { label: "Residuo", field: "residuo.descripcion" },
                        { label: "Recepción", value: (row) => row.transporte?.fechaRecepcion ? new Date(row.transporte.fechaRecepcion).toLocaleDateString() : "—" },
                        { label: "Estado", field: "estado" },
                    ]}
                    // 🌟 BOTÓN DINÁMICO EXCLUSIVO MEDIANTE ACTIONBODY
                    actionBody={(rowData) => {
                        if (activeRole === "GENERADOR" && rowData.estado === "PENDIENTE") {
                            return (
                                <Button
                                    icon="pi pi-check"
                                    title="Firmar y Aprobar Manifiesto"
                                    rounded
                                    outlined
                                    className="text-green-600! border-green-600! rounded-full mx-1! bg-green-50/40 hover:bg-green-50 transition-all duration-150 shadow-md"
                                    onClick={() => {
                                        setSelectedItem(rowData);
                                        setShowApproveModal(true);
                                    }}
                                />
                            );
                        }
                        return null;
                    }}
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

                {/* 🔳 MODAL DE APROBACIÓN CON ENTRADA DE PERMISO B2B */}
                {showApproveModal && (
                    <ApproveManifiestoModal
                        visible={showApproveModal}
                        onHide={() => setShowApproveModal(false)}
                        selected={selectedItem}
                        reload={() => setRefreshKey(prev => prev + 1)}
                    />
                )}
            </>
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
