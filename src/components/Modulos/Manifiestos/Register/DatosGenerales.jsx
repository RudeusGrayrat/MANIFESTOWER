import { useEffect, useState } from "react";
import Input from "../../../ui/inputs/Input";

const Paso1_DatosGenerales = ({ formData, setFormData, user }) => {
    const [transportistaOptions, setTransportistaOptions] = useState([]);
    const [generadorOptions, setGeneradorOptions] = useState([]);
    const [plantaOptions, setPlantaOptions] = useState(formData.generadorId?.plantas || []);

    useEffect(() => {
        if (!formData.generadorId) return;
        const plantasDisponibles = formData.generadorId.plantas || [];
        setPlantaOptions(plantasDisponibles);
    }, [formData.generadorId]);

    return (
        <div className="flex flex-wrap">
            <Input
                label="EO-RS Transportista *"
                type="autocomplete"
                name="transportistaId"
                value={formData.transportistaId}
                setForm={setFormData}
                fetchData="/certificaciones/getTransportistasPaginacion"
                extraParams={{ usuario: user?._id }}
                setOptions={setTransportistaOptions}
                options={transportistaOptions}
                field="razonSocial"
                placeholder="Buscar transportista por RUC o razón social"
            />
            <Input
                label="Generador"
                type="autocomplete"
                name="generadorId"
                ancho="!w-80"
                value={formData.generadorId}
                setForm={setFormData}
                fetchData={`/certificaciones/getGeneradoresByTransportista/${formData.transportistaId?._id || formData.transportistaId}`}
                setOptions={setGeneradorOptions}
                options={generadorOptions}
                field="razonSocial"
                placeholder="Buscar generador por RUC o razón social"
                disabled={!formData.transportistaId}
            />
            <Input
                label="Dirección de planta / Fuente de generación"
                type="select"
                name="planta"
                ancho="!w-80"
                value={formData.planta}
                setForm={setFormData}
                options={plantaOptions}
                optionLabel="direccion"
                placeholder={formData.generadorId ? "Seleccionar planta" : "Primero seleccione un generador"}
                disabled={!formData.generadorId}
            />
            <Input
                label="Responsable de gestion"
                type="select"
                name="responsableGestion"
                value={formData.responsableGestion}
                options={formData.generadorId?.responsablesTecnicos || []} // ✅ ya disponible
                setForm={setFormData}
                optionLabel="nombreResponsable"
                placeholder="Seleccionar responsable de gestión"
                disabled={!formData.planta}
            />
        </div>
    );
};

export default Paso1_DatosGenerales;