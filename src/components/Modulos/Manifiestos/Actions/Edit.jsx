import { useState, useEffect } from "react";
import RegisterManifiestos from "../Register/Register";
import axios from "../../../api/axios";
import dayjs from "dayjs";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../notificaciones/ToastContext";
import { deepDiff } from "../validateEdit";

const EditManifiesto = ({ setShowEdit, selected, reload }) => {
    const { user } = useAuth();
    const { showError, showSuccess, showInfo } = useToast();
    const [formData, setFormData] = useState({
        ...selected
    });

    const [formEdit, setFormEdit] = useState(formData);
    console.log("Datos para edición:", formData);
    console.log("Datos originales:", selected);
    console.log("Diferencias detectadas:", deepDiff(formData, selected));
    console.log("Diferencias detectadas (formEdit):", deepDiff(formEdit, selected));

    const changes = deepDiff(formData, formEdit);
    console.log("Cambios detectados:", changes);
    const datosEnvio = {
        _id: selected._id,
        ...changes,
        // Asegurar que los IDs sean strings, no objetos
        modificadoPor: user._id
    };
    if (changes.generadorId) {
        datosEnvio.generadorId = changes.generadorId?._id || changes.generadorId;
    }
    if (changes.plantaId) {
        datosEnvio.plantaId = changes.plantaId?._id || changes.plantaId;
    }
    if (changes.transportistaId) {
        datosEnvio.transportistaId = changes.transportistaId?._id || changes.transportistaId;
    }
    if (changes.destinoId) {
        datosEnvio.destinoId = changes.destinoId?._id || changes.destinoId;
    }
    console.log("Datos preparados para envío:", datosEnvio);
    const upDate = async () => {
        showInfo("Actualizando manifiesto...");

        try {
            if (Object.keys(changes).length === 0) {
                showInfo("No hay cambios para guardar");
                return;
            }
            // Preparar datos para enviar
            const datosEnvio = {
                _id: selected._id,
                ...changes,
                // Asegurar que los IDs sean strings, no objetos
                modificadoPor: user._id
            };
            if (changes.generadorId) {
                datosEnvio.generadorId = changes.generadorId?._id || changes.generadorId;
            }
            if (changes.plantaId) {
                datosEnvio.plantaId = changes.plantaId?._id || changes.plantaId;
            }
            if (changes.transportistaId) {
                datosEnvio.transportistaId = changes.transportistaId?._id || changes.transportistaId;
            }
            if (changes.destinoId) {
                datosEnvio.destinoId = changes.destinoId?._id || changes.destinoId;
            }

            const response = await axios.patch(`/certificaciones/patchManifiesto/${selected._id}/`, datosEnvio);
            const data = response.data;

            showSuccess(data.message || "Manifiesto actualizado correctamente");

            if (data.type === "Correcto") {
                reload();
            }
        } catch (error) {
            console.error("Error:", error);
            showError(error.response?.data?.message || "Error al actualizar manifiesto");
        } finally {
            setShowEdit(false);
        }
    };

    // Determinar qué campos deshabilitar según el estado
    const getDisabledFields = () => {
        const disabled = {};

        switch (selected.estado) {
            case 'APROBADO':
            case 'RECHAZADO':
                // No se puede editar nada
                return {
                    generadorId: true,
                    plantaId: true,
                    residuo: true,
                    peligrosidad: true,
                    transportistaId: true,
                    transporte: true,
                    destinoId: true,
                    destinoFinal: true,
                    referendos: true
                };

            case 'EN_REVISION':
                // Solo el operador puede editar ciertos campos
                return {
                    // Deshabilitar todo lo del cliente
                    generadorId: true,
                    plantaId: true,
                    residuo: true,
                    peligrosidad: true,
                    // Habilitar lo del operador
                    transportistaId: false,
                    transporte: false,
                    destinoId: false,
                    destinoFinal: false,
                    referendos: false
                };

            case 'OBSERVADO':
                // El cliente puede editar todo
                return {};

            default:
                return {};
        }
    };

    const disabledFields = getDisabledFields();
    return (
        <div className="w-[90%] h-[93%] bg-white flex flex-col justify-center
            border-gray-100 border shadow-2xl fixed top-5 z-50 rounded-xl">


            <div className="flex flex-col h-[90%] space-y-4 p-2 overflow-y-auto">
                <RegisterManifiestos
                    // Pasar datos para edición
                    formEdit={formEdit}
                    setFormEdit={setFormEdit}

                    // Funciones de edición
                    editUpdate={upDate}
                    editCancel={() => setShowEdit(false)}

                    // 🔥 Pasar campos deshabilitados
                    disabledFields={disabledFields}
                />
            </div>
        </div>
    );
};

export default EditManifiesto;