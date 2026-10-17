import { useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";
import axios from "../../../api/axios";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../notificaciones/ToastContext";

const ObserveManifiesto = ({ selected, onHide, reload }) => {
    const { user } = useAuth();
    const { showSuccess, showError } = useToast();
    const [observacion, setObservacion] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const enviar = async () => {
        if (!observacion.trim()) return showError("Indica qué debe corregir el transportista.");
        setSubmitting(true);
        try {
            const response = await axios.patch(`/manifesTower/observarManifiestoGenerador/${selected._id}`, {
                observacion: observacion.trim(), usuarioId: user?._id,
            });
            showSuccess(response.data?.message || "Observación enviada al transportista.");
            onHide();
            reload();
        } catch (error) {
            showError(error.response?.data?.message || "No se pudo observar el manifiesto.");
        } finally {
            setSubmitting(false);
        }
    };

    return <Dialog visible onHide={() => !submitting && onHide()} header="Solicitar corrección" modal className="w-11/12 max-w-md"
        footer={<div className="flex justify-end gap-2"><Button label="Cancelar" text onClick={onHide} disabled={submitting} />
            <Button label="Enviar observación" icon={submitting ? "pi pi-spin pi-spinner" : "pi pi-comment"} onClick={enviar} disabled={submitting} /></div>}>
        <p className="text-sm text-slate-600 mb-3">El manifiesto {selected?.numeroManifiesto} volverá al transportista para su corrección.</p>
        <label htmlFor="observacion-generador" className="font-semibold text-sm">Motivo de la observación</label>
        <InputTextarea id="observacion-generador" value={observacion} onChange={(event) => setObservacion(event.target.value)} rows={4} className="w-full mt-2" />
    </Dialog>;
};

export default ObserveManifiesto;
