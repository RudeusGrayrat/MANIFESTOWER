import Input from "../../../ui/inputs/Input";
import InputNormal from "../../../ui/inputs/Normal";

const Paso2_Residuo = ({ formData, setFormData }) => {
    const estadosFisicos = ["SOLIDO", "SEMISOLIDO", "LIQUIDO", "GAS"]
    const codigosBasilea = [
        { value: "A1", label: "A1 - Residuos metálicos o que contengan metales" },
        { value: "A2", label: "A2 - Residuos con constituyentes inorgánicos" },
        { value: "A3", label: "A3 - Residuos con constituyentes orgánicos" },
        { value: "A4", label: "A4 - Residuos con constituyentes mixtos" }
    ];

    const handleResiduoChange = (campo, valor) => {
        setFormData(prev => ({
            ...prev,
            residuo: {
                ...prev.residuo,
                [campo]: valor
            }
        }));
    };

    return (
        // El flex-wrap ya está aquí, perfecto.
        <div className="flex flex-wrap gap-2 max-md:px-8">
            <Input
                label="Descripción del residuo *"
                value={formData.residuo?.descripcion || ""}
                onChange={(e) => handleResiduoChange('descripcion', e.target.value.toUpperCase())}
                placeholder="Describa el residuo peligroso"
            />

            <Input
                label="Cantidad total (toneladas) *"
                type="number"
                step="0.01"
                value={formData.residuo?.cantidadTotal || ""}
                onChange={(e) => handleResiduoChange('cantidadTotal', e.target.value)}
                placeholder="Ej: 15.5"
            />

            <Input
                label="Estado del residuo *"
                type="select"
                value={formData.residuo?.estadoFisico}
                onChange={(e) => handleResiduoChange('estadoFisico', e.target.value)}
                options={estadosFisicos}
            />

            <Input
                label="Tipo de recipiente"
                value={formData.residuo?.tipoRecipiente || ""}
                onChange={(e) => handleResiduoChange('tipoRecipiente', e.target.value.toUpperCase())}
                placeholder="Ej: CILINDRO, SACO"
            />

            <Input
                label="Material"
                value={formData.residuo?.materialRecipiente || ""}
                onChange={(e) => handleResiduoChange('materialRecipiente', e.target.value.toUpperCase())}
                placeholder="Ej: METAL, PLÁSTICO"
            />

            <Input
                label="N° de recipientes"
                type="number" // Cambiado a number para mejorar la UX en móvil
                value={formData.residuo?.numeroRecipientes || ""}
                onChange={(e) => handleResiduoChange('numeroRecipientes', e.target.value)}
            />

            <Input
                label="Código de clasificación *"
                type="select"
                value={formData.residuo?.codigoBasilea || ""}
                onChange={(e) => handleResiduoChange('codigoBasilea', e.target.value)}
                options={codigosBasilea}
                optionLabel="label"
                optionValue="value"
            />

            <Input
                label="Subcódigo (A-...)"
                value={formData.residuo?.subcodigoBasilea || ""}
                onChange={(e) => handleResiduoChange('subcodigoBasilea', e.target.value.toUpperCase())}
                placeholder="Ej: A1010"
            />

            <InputNormal
                label="Información adicional"
                value={formData.residuo?.informacionAdicional || ""}
                onChange={(e) => handleResiduoChange('informacionAdicional', e.target.value)}
                placeholder="Información complementaria"
            />
        </div>
    );
};

export default Paso2_Residuo;