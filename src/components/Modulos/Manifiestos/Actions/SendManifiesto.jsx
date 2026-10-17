import { useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import axios from "../../../api/axios";
import { useToast } from "../../../notificaciones/ToastContext";
import { useAuth } from "../../../context/AuthContext";

const SendManifiesto = ({ setShowSend, selected, reload }) => {
    const { showSuccess, showError } = useToast();
    const { user } = useAuth();
    const [submitting, setSubmitting] = useState(false);
    const reenviar = selected?.estado === "OBSERVADO";

    const handleConfirm = async () => {
        setSubmitting(true);
        try {
            const response = await axios.post(`/manifesTower/enviarManifiesto/${selected._id}`, { usuarioId: user?._id });
            showSuccess(response.data?.message || "Manifiesto enviado correctamente.");
            setShowSend(false);
            reload();
        } catch (error) {
            showError(error.response?.data?.message || "No se pudo enviar el manifiesto.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog visible onHide={() => !submitting && setShowSend(false)} header={reenviar ? "Reenviar manifiesto" : "Enviar manifiesto"} modal className="w-11/12 max-w-md"
            footer={<div className="flex justify-end gap-2">
                <Button label="Cancelar" text onClick={() => setShowSend(false)} disabled={submitting} />
                <Button label={reenviar ? "Reenviar" : "Enviar"} icon={submitting ? "pi pi-spin pi-spinner" : "pi pi-send"} onClick={handleConfirm} disabled={submitting} />
            </div>}>
            <div className="text-sm text-slate-600 space-y-3">
                <p>Se enviará el manifiesto <strong>{selected?.numeroManifiesto}</strong> del generador <strong>{selected?.generadorId?.razonSocial || "seleccionado"}</strong>.</p>
                {reenviar && selected?.observacion && <p><strong>Última observación:</strong> {selected.observacion}</p>}
                <p>Se registrará la firma del responsable del transportista. El generador deberá revisarlo antes de enviarlo al destino.</p>
            </div>
        </Dialog>
    );
};

export default SendManifiesto;
