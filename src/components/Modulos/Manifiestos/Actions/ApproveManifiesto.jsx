// components/Modulos/Certificaciones/ManifesTower/Actions/ApproveManifiestoModal.jsx
import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputSwitch } from "primereact/inputswitch";
import axios from "../../../api/axios";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../notificaciones/ToastContext";

const ApproveManifiestoModal = ({ visible, onHide, selected, reload }) => {
    const { user } = useAuth();
    const { showSuccess, showError } = useToast();
    const [loading, setLoading] = useState(false);
    const [otorgarPermiso, setOtorgarPermiso] = useState(false);
    const responsables = selected?.generadorId?.responsablesTecnicos || [];
    const nombreSeleccionado = selected?.referendoEntrega?.generadorResponsableManejo;
    const responsableFirmante = nombreSeleccionado
        ? responsables.find((responsable) => responsable.nombreResponsable === nombreSeleccionado && responsable.firmaResponsable)
        : responsables.find((responsable) => responsable.firmaResponsable);

    const handleConfirmApprove = async () => {
        setLoading(false);
        setLoading(true);
        try {
            const response = await axios.patch(`/manifesTower/aprobarManifiestoGenerador/${selected._id}`, null, {
                params: {
                    usuarioId: user?._id,
                    otorgarPermisoLlenado: otorgarPermiso
                }
            });

            showSuccess(response.data?.message || "Manifiesto firmado y despachado con éxito.");
            reload();
            onHide();
        } catch (error) {
            console.error("Error al aprobar manifiesto:", error);
            showError(error.response?.data?.message || "No se pudo procesar la aprobación del manifiesto.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            visible={visible}
            onHide={onHide}
            header="Firmar y Despachar Manifiesto"
            modal
            className="w-11/12 max-w-md"
            footer={
                <div className="flex justify-end gap-2 mt-4">
                    <Button label="Cancelar" className="p-button-text text-slate-500!" onClick={onHide} disabled={loading} />
                    <Button label="Firmar y Enviar" icon={loading ? "pi pi-spin pi-spinner" : "pi pi-check"} className="bg-green-600! border-green-600!" onClick={handleConfirmApprove} disabled={loading} />
                </div>
            }
        >
            <div className="text-sm text-slate-600 leading-relaxed flex flex-col gap-4">
                <p>
                    ¿Deseas autorizar el manifiesto N° {selected?.numeroManifiesto} con la firma registrada de tu responsable?
                </p>
                <p className="text-xs text-slate-400">
                    Al confirmar, se registrará la imagen de firma del responsable y el manifiesto pasará a <span className="font-semibold text-blue-600">ENVIADO</span>. Esta imagen no es una firma digital criptográfica.
                </p>
                <p className="text-xs text-slate-600">
                    Responsable: <strong>{responsableFirmante?.nombreResponsable || nombreSeleccionado || "Sin firma disponible"}</strong>.
                </p>

                {/* Card de sugerencia para evitar flujos manuales repetitivos */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl mt-2 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-800 text-xs">¿Es un transportista frecuente?</span>
                        <InputSwitch checked={otorgarPermiso} onChange={(e) => setOtorgarPermiso(e.value)} />
                    </div>
                    <p className="text-xs text-slate-500 leading-normal">
                        Autoriza a <span className="font-semibold text-slate-700">{selected?.transportistaId?.razonSocial || "este transportista"}</span> a utilizar tus datos para llenar manifiestos. Este permiso no autoriza el uso automático de tu firma: por ahora deberás revisar cada manifiesto.
                    </p>
                    {otorgarPermiso && (
                        <div className="p-2.5 rounded-lg border border-amber-100 bg-amber-50 text-[11px] text-amber-700 leading-relaxed flex gap-2 items-start">
                            <i className="pi pi-exclamation-triangle mt-0.5"></i>
                            <span>Podrás revocar o modificar este acceso de datos fiscales en cualquier momento desde tu panel de <strong>Transportistas</strong>.</span>
                        </div>
                    )}
                </div>
            </div>
        </Dialog>
    );
};

export default ApproveManifiestoModal;
