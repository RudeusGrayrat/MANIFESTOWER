import { useEffect, useState } from "react";
import Input from "../../../ui/inputs/Input";
import axios from "../../../api/axios"; // 🌟 Asegúrate de importar axios

const Paso1_DatosGenerales = ({ formData, setFormData, user }) => {
    const [transportistaOptions, setTransportistaOptions] = useState([]);
    const [generadorOptions, setGeneradorOptions] = useState([]);
    const [plantaOptions, setPlantaOptions] = useState(formData.generadorId?.plantas || []);
    useEffect(() => {
        const cargarTransportista = async () => {
            if (formData.generadorId && generadorOptions.length === 0) {
                setGeneradorOptions([formData.generadorId]);
            }
            const idTransportista = formData.transportistaId?._id || formData.transportistaId || user?.transportistaId;

            if (idTransportista) {
                try {
                    const response = await axios.get(`/certificaciones/getTransportistaById/${idTransportista}`);
                    const data = response.data;

                    if (data) {
                        if (typeof formData.transportistaId !== 'object') {
                            setFormData((prev) => ({ ...prev, transportistaId: data }));
                        }

                        setTransportistaOptions([data]);

                        const generadoresAplanados = (data.generadores || [])
                            .map(g => g.generadorId)
                            .filter(Boolean);

                        setGeneradorOptions(generadoresAplanados);
                    }
                } catch (error) {
                    console.error("Error al obtener los datos del transportista:", error);
                }
            }
        };

        cargarTransportista();
    }, [formData.generadorId]);

    useEffect(() => {
        if (!formData.generadorId) {
            setPlantaOptions([]);
            return;
        }
        const plantasDisponibles = formData.generadorId.plantas || [];
        setPlantaOptions(plantasDisponibles);
    }, [formData.generadorId]);

    // En Paso1_DatosGenerales.jsx
    return (
        <div className="flex flex-wrap gap-2 max-md:px-8">
            <Input
                label="EO-RS Transportista *"
                disabled
                name="transportistaId"
                value={formData.transportistaId?.razonSocial || ""}
                options={transportistaOptions}
                placeholder="Cargando transportista..."
            />
            <Input
                label="Generador"
                type="select"
                name="generadorId"
                editable={false}
                // Eliminamos ancho="!w-80"
                dataKey="_id"
                value={formData.generadorId}
                setForm={setFormData}
                options={generadorOptions}
                optionLabel="razonSocial"
                placeholder="Buscar generador..."
                disabled={!formData.transportistaId}
            />
            <Input
                label="Dirección de planta"
                type="select"
                name="planta"
                // Eliminamos ancho="!w-80"
                value={formData.planta}
                setForm={setFormData}
                options={plantaOptions}
                optionLabel="direccion"
                placeholder="Seleccionar planta"
                disabled={!formData.generadorId}
            />
            <Input
                label="Responsable de gestión"
                type="select"
                name="responsableGestion"
                value={formData.responsableGestion}
                options={formData.generadorId?.responsablesTecnicos || []}
                setForm={setFormData}
                optionLabel="nombreResponsable"
                placeholder="Seleccionar responsable"
                disabled={!formData.planta}
            />
        </div>
    );
};

export default Paso1_DatosGenerales;