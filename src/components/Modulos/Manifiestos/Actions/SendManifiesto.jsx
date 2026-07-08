import { useState } from "react";
import { useToast } from "../../../notificaciones/ToastContext";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

const SendManifiesto = ({ setShowSend, selected, reload }) => {
    const { showSuccess, showError } = useToast();
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [permisoLlenado, setPermisoLlenado] = useState(false);
    const [showInfoPermiso, setShowInfoPermiso] = useState(false);
    const esGenerador = selected?.generadorId?._id === selected?.usuarioId?._id;

    const handleConfirm = async () => {
        setSubmitting(true);
        try {
            // Aquí iría la lógica para enviar el manifiesto y manejar la respuesta
            // Por ejemplo, una llamada a la API para enviar el manifiesto
            // await api.sendManifiesto(selected._id, permisoLlenado);
        } catch (error) {
            showError("Error al enviar el manifiesto: " + error.message);
        } finally {
            setSubmitting(false);
            setShowSend(false);
            reload(); // Recargar la lista después de enviar
        }
    }
    return (
        <Dialog
            visible={true}
            onHide={() => setShowSend(false)}
            header="Confirmar Enlace Comercial"
            modal
            className="w-11/12 max-w-md"
            footer={
                <div className="flex justify-end gap-2 mt-4">
                    <Button label="Cancelar" className="p-button-text text-slate-500!" onClick={() => setShowSend(false)} disabled={submitting} />
                    <Button label="Aceptar e Interconectar" icon={submitting ? "pi pi-spin pi-spinner" : "pi pi-check"} className="bg-green-600! border-green-600!" onClick={handleConfirm} disabled={submitting} />
                </div>
            }
        >
            <div className="text-sm text-slate-600 leading-relaxed flex flex-col gap-4">
                <p>
                    ¿Estás seguro de que deseas **aceptar** la solicitud de vinculación con{" "}
                    <span className="font-bold text-slate-900">{"pruebaa"}</span>?
                </p>

                {esGenerador && (
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl mt-2 flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-800 text-xs">Autorizar uso de mis datos</span>
                            <div className="flex items-center gap-2">
                                <Button
                                    type="button"
                                    icon="pi pi-info-circle"
                                    rounded
                                    text
                                    severity="info"
                                    className="w-8 h-8 text-[#285598]!"
                                    onClick={() => setShowInfoPermiso((prev) => !prev)}
                                    aria-label="Ver información del permiso"
                                />
                                <InputSwitch checked={permisoLlenado} onChange={(e) => setPermisoLlenado(e.value)} />
                            </div>
                        </div>
                        {showInfoPermiso && (
                            <div className="p-3 rounded-lg border border-blue-100 bg-blue-50 text-xs text-blue-700 leading-relaxed">
                                Este permiso permite que la empresa vinculada use tus datos fiscales y operativos para generar manifiestos de forma automática.
                            </div>
                        )}
                        <p className="text-xs text-slate-400">
                            Si lo activas, esta empresa de transporte podrá utilizar tu información fiscal y operativa para la autogeneración de manifiestos.
                        </p>
                    </div>
                )}
            </div>
        </Dialog>
    );
};

export default SendManifiesto;