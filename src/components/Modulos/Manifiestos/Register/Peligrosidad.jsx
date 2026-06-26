import Input from "../../../ui/inputs/Input";
import InputNormal from "../../../ui/inputs/Normal";

const Paso3_Peligrosidad = ({ formData, setFormData }) => {
    const peligrosidades = [
        { key: 'explosivos', label: 'Explosivos' },
        { key: 'oxidantes', label: 'Oxidantes' },
        { key: 'gasesToxicos', label: 'Liberación de gases tóxicos' },
        { key: 'liquidosInflamables', label: 'Líquidos inflamables' },
        { key: 'peroxidosOrganicos', label: 'Peróxidos orgánicos' },
        { key: 'toxicosCronicos', label: 'Sustancias tóxicas (efectos crónicos)' },
        { key: 'solidosInflamables', label: 'Sólidos inflamables' },
        { key: 'toxicosAgudos', label: 'Tóxicos (venenosos) agudos' },
        { key: 'ecotoxicos', label: 'Ecotóxicos' },
        { key: 'combustionEspontanea', label: 'Combustión espontánea' },
        { key: 'sustanciasInfecciosas', label: 'Sustancias infecciosas' },
        { key: 'sustanciasSecundarias', label: 'Pueden dar origen a otra sustancia' },
        { key: 'gasesInflamablesAgua', label: 'En contacto con agua emiten gases inflamables' },
        { key: 'corrosivos', label: 'Corrosivos' }
    ];

    const handleCheckboxChange = (key, checked) => {
        setFormData(prev => ({
            ...prev,
            peligrosidad: {
                ...prev.peligrosidad,
                [key]: checked
            }
        }));
    };

    const handleOtrosChange = (valor) => {
        setFormData(prev => ({
            ...prev,
            peligrosidad: {
                ...prev.peligrosidad,
                otros: valor
            }
        }));
    };

    return (
        <div className="flex flex-wrap">
            <div className="w-full mb-4">
                <h3 className="text-lg font-medium text-gray-700 mb-3">
                    Características de peligrosidad (marque todas las que correspondan)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {peligrosidades.map(peli => (
                        <label key={peli.key} className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={formData.peligrosidad?.[peli.key] || false}
                                onChange={(e) => handleCheckboxChange(peli.key, e.target.checked)}
                                className="h-4 w-4 text-[#285598] focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <span className="text-sm text-gray-700">{peli.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            <InputNormal
                label="Otros (especificar)"
                value={formData.peligrosidad?.otros || ""}
                onChange={(e) => handleOtrosChange(e.target.value)}
                placeholder="Especifique otras características de peligrosidad"
                ancho="w-full"
            />
        </div>
    );
};

export default Paso3_Peligrosidad;