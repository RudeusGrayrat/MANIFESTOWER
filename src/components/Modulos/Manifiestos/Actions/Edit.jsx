import { useState } from "react";
import RegisterManifiestos from "../Register/Register";
import axios from "../../../api/axios";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../notificaciones/ToastContext";
import { deepDiff } from "../validateEdit";

const prepararFormulario = (selected) => ({
    ...selected,
    transporte: {
        ...selected.transporte,
        fechaRecepcion: selected.transporte?.fechaRecepcion?.slice(0, 10) || "",
    },
});

const EditManifiesto = ({ setShowEdit, selected, reload }) => {
    const { user } = useAuth();
    const { showError, showSuccess, showInfo } = useToast();
    const [original] = useState(() => prepararFormulario(selected));
    const [formEdit, setFormEdit] = useState(() => prepararFormulario(selected));
    const [saving, setSaving] = useState(false);

    const upDate = async () => {
        if (saving) return;
        const changes = deepDiff(original, formEdit);
        if (!Object.keys(changes).length) return showInfo("No hay cambios para guardar.");
        const payload = { ...changes, modificadoPor: user?._id };
        for (const key of ["generadorId", "transportistaId", "destinoId"]) {
            if (changes[key]) payload[key] = formEdit[key]?._id || formEdit[key];
        }
        if (changes.planta?.ubigeoId) payload.planta.ubigeoId = formEdit.planta?.ubigeoId?._id || formEdit.planta?.ubigeoId;
        setSaving(true);
        try {
            const response = await axios.patch(`/certificaciones/patchManifiesto/${selected._id}`, payload);
            showSuccess(response.data?.message || "Manifiesto actualizado correctamente.");
            reload();
            setShowEdit(false);
        } catch (error) {
            showError(error.response?.data?.message || "No se pudo actualizar el manifiesto.");
        } finally {
            setSaving(false);
        }
    };

    return <div className="w-[90%] h-[93%] bg-white flex flex-col justify-center border-gray-100 border shadow-2xl fixed top-5 z-50 rounded-xl">
        {selected.estado === "OBSERVADO" && <div className="mx-4 mt-3 p-3 rounded bg-amber-50 text-amber-900 text-sm">
            <strong>Observación:</strong> {selected.observacion || "Consulta al revisor."} Después de guardar, vuelve a enviar el manifiesto.
        </div>}
        <div className="flex flex-col h-[90%] space-y-4 p-2 overflow-y-auto">
            <RegisterManifiestos formEdit={formEdit} setFormEdit={setFormEdit} editUpdate={upDate} editCancel={() => setShowEdit(false)} />
        </div>
    </div>;
};

export default EditManifiesto;
