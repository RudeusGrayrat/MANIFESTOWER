import { useEffect, useState } from "react";
import Input from "../../../ui/inputs/Input";
import axios from "../../../api/axios"; // 🌟 Asegúrate de importar axios

const Paso1_DatosGenerales = ({ formData, setFormData, user }) => {
    const [transportistaOptions, setTransportistaOptions] = useState([]);
    const [generadorOptions, setGeneradorOptions] = useState([]);
    const [plantaOptions, setPlantaOptions] = useState(formData.generadorId?.plantas || []);

    // 🌟 1. Efecto para cargar los datos del Transportista por el ID del usuario
    useEffect(() => {
        const cargarTransportista = async () => {
            // Si el usuario tiene un transportistaId y no se ha cargado aún en el formData
            if (user?.transportistaId && !formData.transportistaId) {
                try {
                    const response = await axios.get(`/certificaciones/getTransportistaById/${user.transportistaId}`);
                    const data = response.data;
                    console.log("Datos del transportista obtenidos:", data);
                    if (data) {
                        // Guardamos todo el objeto en el formData
                        setFormData((prev) => ({
                            ...prev,
                            transportistaId: data
                        }));
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
    }, []);

    // 2. Efecto para manejar el cambio de plantas cuando cambia el generador
    useEffect(() => {
        if (!formData.generadorId) {
            setPlantaOptions([]);
            return;
        }
        const plantasDisponibles = formData.generadorId.plantas || [];
        setPlantaOptions(plantasDisponibles);
    }, [formData.generadorId]);

    return (
        <div className="flex flex-wrap gap-4">
            <Input
                label="EO-RS Transportista *"
                disabled
                type="select"
                name="transportistaId"
                value={formData.transportistaId}
                options={transportistaOptions}
                optionLabel="razonSocial"
                editable={false}
                placeholder="Cargando transportista..."
            />
            <Input
                label="Generador"
                type="select"
                name="generadorId"
                ancho="!w-80"
                value={formData.generadorId}
                setForm={setFormData}
                options={generadorOptions}
                optionLabel="razonSocial"
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
                options={formData.generadorId?.responsablesTecnicos || []}
                setForm={setFormData}
                optionLabel="nombreResponsable"
                placeholder="Seleccionar responsable de gestión"
                disabled={!formData.planta}
            />
        </div>
    );
};

export default Paso1_DatosGenerales;