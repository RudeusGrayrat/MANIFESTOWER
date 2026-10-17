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
    const subcodigosBasilea = {
        A1: ["A1010", "A1020", "A1030", "A1040", "A1050", "A1060", "A1070", "A1080", "A1090", "A1100", "A1110", "A1120", "A1130", "A1140", "A1150", "A1160", "A1170", "A1180", "A1190"],
        A2: ["A2010", "A2020", "A2030", "A2040", "A2050", "A2060"],
        A3: ["A3010", "A3020", "A3030", "A3040", "A3050", "A3060", "A3070", "A3080", "A3090", "A3100", "A3110", "A3120", "A3130", "A3140", "A3150", "A3160", "A3170", "A3180", "A3190", "A3200", "A3210"],
        A4: ["A4010", "A4020", "A4030", "A4040", "A4050", "A4060", "A4070", "A4080", "A4090", "A4100", "A4110", "A4120", "A4130", "A4140", "A4150", "A4160", "A4170", "A4180", "A4190", "A4200"],
    };
    const codigoBasilea = formData.residuo?.codigoBasilea || "";
    const opcionesSubcodigo = (subcodigosBasilea[codigoBasilea] || []).map((value) => ({ value, label: value }));

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
                type="text"
                value={formData.residuo?.numeroRecipientes || ""}
                onChange={(e) => handleResiduoChange('numeroRecipientes', e.target.value)}
                placeholder="Ej: 12 BIDONES"
            />

            <Input
                label="Código de clasificación *"
                type="select"
                value={formData.residuo?.codigoBasilea || ""}
                onChange={(e) => {
                    handleResiduoChange('codigoBasilea', e.target.value);
                    handleResiduoChange('subcodigoBasilea', '');
                }}
                options={codigosBasilea}
                optionLabel="label"
                optionValue="value"
            />

            <Input
                label="Subcódigo (A-...)"
                type="select"
                value={formData.residuo?.subcodigoBasilea || ""}
                onChange={(e) => handleResiduoChange('subcodigoBasilea', e.target.value)}
                options={opcionesSubcodigo}
                optionLabel="label"
                optionValue="value"
                placeholder={codigoBasilea ? "Seleccione un subcódigo" : "Seleccione primero el código"}
                disabled={!codigoBasilea}
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
