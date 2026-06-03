import Input from "../../../ui/inputs/Input";

const Representante_y_Responsable = ({ formData, setFormData }) => {
    const handleChangeResponsableTecnico = (field, value) => {
        setFormData(prev => ({
            ...prev,
            responsableTecnico: {
                ...prev.responsableTecnico,
                [field]: value
            }
        }));
    };
    const handleChangeRepresentanteLegal = (field, value) => {
        setFormData(prev => ({
            ...prev,
            representanteLegal: {
                ...prev.representanteLegal,
                [field]: value
            }
        }));
    };
    return (
        <div className="flex flex-wrap">
            <Input
                ancho="!w-96"
                label="Nombre del Representante Legal"
                name="nombre"
                value={formData.representanteLegal?.nombre || ""}
                onChange={(e) => handleChangeRepresentanteLegal('nombre', e.target.value.toUpperCase())}
                placeholder="Nombres y apellidos"
            />
            <Input
                label="DNI/CE del Representante Legal"
                value={formData.representanteLegal?.dni || ""}
                onChange={(e) => handleChangeRepresentanteLegal('dni', e.target.value)}
                maxLength={12}
                placeholder="Ej: 12345678"
                onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) {
                        e.preventDefault();
                    }
                }}
            />
            <Input
                ancho="!w-96"
                label="Nombre del Responsable Técnico"
                value={formData.responsableTecnico?.nombre || ""}
                onChange={(e) => handleChangeResponsableTecnico('nombre', e.target.value.toUpperCase())}
                placeholder="Nombres y apellidos "
            />
            <Input
                label="N° de Colegiatura"
                name="numeroColegiatura"
                value={formData.responsableTecnico?.numeroColegiatura || ""}
                onChange={(e) => handleChangeResponsableTecnico('numeroColegiatura', e.target.value)}
                placeholder="Ej: CIP 123456"
            />

        </div>

    );
};

export default Representante_y_Responsable;