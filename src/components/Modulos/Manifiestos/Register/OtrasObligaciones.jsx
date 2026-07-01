import { useEffect, useState } from "react";
import Input from "../../../ui/inputs/Input";

const Paso6_OtrasObligaciones = ({ formData, setFormData }) => {
    const [responsableOptions, setResponsableOptions] = useState([]);
    const [representanteOptions, setRepresentanteOptions] = useState([]);
    const [devolucionForm, setDevolucionForm] = useState({
        representanteEors: "",
        generadorResponsableManejo: "",
        fecha: "",
        hora: ""
    });
    useEffect(() => {
        if (formData.transportistaId) {
            const representantes = formData.transportistaId.responsables || [];
            setRepresentanteOptions(representantes);
            setDevolucionForm(prev => ({
                ...prev,
                representanteEors: representantes.length > 0 ? representantes[0] : ""
            }));
        }
    }, [formData.transportistaId]);
    useEffect(() => {
        if (formData.generadorId) {
            const responsables = formData.generadorId.responsablesTecnicos || [];
            setResponsableOptions(responsables);
            setDevolucionForm(prev => ({
                ...prev,
                generadorResponsableManejo: responsables.length > 0 ? responsables[0] : ""
            }));
        } else {
            setResponsableOptions([]);
        }
    }, [formData.generadorId]);
    const handleOtrasObligacionesChange = (campo, valor) => {
        setFormData(prev => ({
            ...prev,
            otrasObligaciones: {
                ...prev.otrasObligaciones,
                [campo]: valor
            }
        }));
    }
    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            otrasObligaciones: {
                ...prev.otrasObligaciones,
                representanteEors: devolucionForm.representanteEors.nombre,
                cargoRepresentanteEors: devolucionForm.representanteEors?.cargo || "",
                dniRepresentanteEors: devolucionForm.representanteEors?.dni || "",
                firmaRepresentanteEors: devolucionForm.representanteEors?.firmaResponsable || "",
                generadorResponsableManejo: devolucionForm.generadorResponsableManejo.nombreResponsable,
                cargoGeneradorResponsableManejo: devolucionForm.generadorResponsableManejo?.cargoResponsable || "",
                dniGeneradorResponsableManejo: devolucionForm.generadorResponsableManejo?.dniResponsable || "",
                firmaGeneradorResponsableManejo: devolucionForm.generadorResponsableManejo?.firmaResponsable || "",
            }
        }));
    }, [devolucionForm]);
    return (
        <div className="w-full mt-4 border-t pt-4">
            <h3 className="text-lg font-medium text-gray-700 mb-3">Sección 4.2 - Devolución del Manifiesto</h3>

            <div className="grid">
                <h4 className="font-medium mb-2">Representante EO-RS (entrega)</h4>
                <div className="border border-gray-200 flex flex-wrap rounded-lg p-3">
                    <Input
                        label="Nombre"
                        type="select"
                        name="representanteEors"
                        value={devolucionForm.representanteEors}
                        options={representanteOptions}
                        optionLabel="nombre"
                        setForm={setDevolucionForm}
                    />
                    <Input
                        label="Cargo"
                        value={devolucionForm.representanteEors?.cargo || ""}
                        disabled
                    />
                    <Input
                        label="DNI"
                        value={devolucionForm.representanteEors?.dni || ""}
                        disabled
                    />

                    <Input
                        label="Firma del representante EO-RS"
                        value={devolucionForm.representanteEors?.firmaResponsable || ""}
                        ancho="w-full"
                        disabled
                    />
                </div>

                <h4 className="font-medium mb-2">Responsable Generador (recibe)</h4>
                <div className="border border-gray-200 flex flex-wrap rounded-lg p-3">
                    <Input
                        label="Nombre"
                        value={devolucionForm.generadorResponsableManejo}
                        type="select"
                        name="generadorResponsableManejo"
                        options={responsableOptions}
                        optionLabel="nombreResponsable"
                        setForm={setDevolucionForm}
                    />
                    <Input
                        label="Cargo"
                        value={devolucionForm.generadorResponsableManejo?.cargoResponsable || ""}
                        disabled
                    />
                    <Input
                        label="DNI"
                        value={devolucionForm.generadorResponsableManejo?.dniResponsable || ""}
                        disabled
                    />
                    <Input
                        label="Firma del responsable generador"
                        value={devolucionForm.generadorResponsableManejo?.firmaResponsable || ""}
                        disabled
                    />
                    <Input
                        label="Fecha de devolución"
                        type="date"
                        value={formData.otrasObligaciones.fecha || ""}
                        onChange={(e) => handleOtrasObligacionesChange('fecha', e.target.value)}
                    />
                    <Input
                        label="Hora de devolución"
                        type="time"
                        value={formData.otrasObligaciones.hora || ""}
                        onChange={(e) => handleOtrasObligacionesChange('hora', e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
}

export default Paso6_OtrasObligaciones;