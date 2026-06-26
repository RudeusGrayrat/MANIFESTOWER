import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

const ConfirmDesvinculacionModal = ({ visible, onHide, onConfirm, rowData, loading }) => {

    // Pie de página personalizado para el modal
    const footerContent = (
        <div className="flex justify-end gap-3 mt-4">
            <Button
                label="Cancelar"
                icon="pi pi-times"
                outlined
                onClick={onHide}
                className="p-button-text text-gray-600 border-gray-300 hover:bg-gray-100"
                disabled={loading}
            />
            <Button
                label={loading ? "Desvinculando..." : "Sí, Desvincular"}
                icon={loading ? "pi pi-spin pi-spinner" : "pi pi-trash"}
                severity="danger"
                onClick={onConfirm}
                className="bg-red-600 hover:bg-red-700 text-white border-none"
                disabled={loading}
            />
        </div>
    );

    return (
        <Dialog
            header={
                <div className="flex items-center gap-2 text-red-600 font-semibold text-lg">
                    <i className="pi pi-exclamation-triangle text-2xl"></i>
                    <span>Advertencia de Desvinculación</span>
                </div>
            }
            visible={visible}
            style={{ width: '450px' }}
            modal
            footer={footerContent}
            onHide={onHide}
            draggable={false}
            resizable={false}
            className="rounded-xl shadow-2xl"
        >
            <div className="flex flex-col gap-3 py-2 text-gray-700">
                <p className="font-medium">
                    ¿Estás seguro de que deseas desvincularte de la empresa: <br />
                    <strong className="text-gray-900 block mt-1 text-base bg-gray-50 p-2 rounded-lg border border-gray-150">
                        {rowData?.razonSocial || "este transportista"}
                    </strong>
                </p>

                <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded-r-lg text-sm text-red-700 leading-relaxed mt-2">
                    <p className="font-semibold mb-1">¡Atención!</p>
                    Esta acción romperá el vínculo operacional inmediatamente. No podrás asignarle nuevos despachos ni visualizar sus certificaciones activas hasta que se vuelva a aprobar una nueva solicitud de vinculación.
                </div>
            </div>
        </Dialog>
    );
};

export default ConfirmDesvinculacionModal;