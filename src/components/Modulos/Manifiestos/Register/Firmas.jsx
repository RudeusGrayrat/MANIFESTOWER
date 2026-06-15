import Input from "../../../../recicle/Inputs/Inputs";

const Paso7_Firmas = ({ formData, setFormData }) => {
    // Este paso normalmente se llenaría después, al momento de las firmas
    // Por ahora mostramos solo información

    return (
        <div className="flex flex-wrap">
            <div className="w-full md:w-1/2 p-2">
                <h3 className="text-lg font-medium text-gray-700 mb-3">REFERENDO - Entrega</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">
                        Este apartado será llenado al momento de la entrega de residuos al transportista.
                    </p>
                    <p className="text-sm text-gray-600">
                        Se requerirá:
                    </p>
                    <ul className="list-disc list-inside text-sm text-gray-600 mt-2">
                        <li>Firma del Generador</li>
                        <li>Firma del Transportista</li>
                        <li>DNI y cargo del transportista</li>
                        <li>Fecha y hora de entrega</li>
                    </ul>
                </div>
            </div>

            <div className="w-full md:w-1/2 p-2">
                <h3 className="text-lg font-medium text-gray-700 mb-3">REFERENDO - Recepción</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">
                        Este apartado será llenado al momento de la recepción en el destino final.
                    </p>
                    <p className="text-sm text-gray-600">
                        Se requerirá:
                    </p>
                    <ul className="list-disc list-inside text-sm text-gray-600 mt-2">
                        <li>Firma del responsable del destino</li>
                        <li>DNI y cargo</li>
                        <li>Fecha y hora de recepción</li>
                        <li>Cantidad recibida</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Paso7_Firmas;