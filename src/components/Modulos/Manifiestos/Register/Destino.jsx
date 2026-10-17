import { useState, useEffect } from "react";
import Input from "../../../ui/inputs/Input";
import InputNormal from "../../../ui/inputs/Normal";
import axios from "../../../api/axios";

const Paso5_Destino = ({ formData, setFormData }) => {
    const [destinoOptions, setDestinoOptions] = useState([]);
    const tipoManejoOptions = ["TRATAMIENTO", "DISPOSICIÓN FINAL", "VALORIZACIÓN"];

    // Mientras Tower sea el único destino operativo, se carga y bloquea aquí.
    // El backend aplica la misma regla para impedir que un cliente la altere.
    useEffect(() => {
        let mounted = true;

        const cargarDestinoPredeterminado = async () => {
            try {
                const response = await axios.get("/certificaciones/getDestinosPaginacion", {
                    params: { page: 0, limit: 1 },
                });
                const destino = response.data?.data?.[0];
                if (!mounted || !destino) return;

                setDestinoOptions([destino]);
                setFormData((prev) => ({
                    ...prev,
                    destinoId: prev.destinoId || destino,
                }));
            } catch (error) {
                console.error("No se pudo cargar el destino predeterminado:", error);
            }
        };

        cargarDestinoPredeterminado();
        return () => { mounted = false; };
    }, [setFormData]);

    // Manejadores directos para evitar estados intermedios y desincronizaciones
    const handleDestinoChange = (campo, valor) => {
        setFormData(prev => ({
            ...prev,
            destinoFinal: {
                ...prev.destinoFinal,
                [campo]: valor
            }
        }));
    };

    const handleOtrosManejosChange = (campo, valor) => {
        setFormData(prev => ({
            ...prev,
            otrosManejos: {
                ...prev.otrosManejos,
                [campo]: valor
            }
        }));
    };

    const clearOtrosManejosFields = () => ({
        razonSocialReceptor: "",
        rucReceptor: "",
        correoReceptor: "",
        telefonoReceptor: "",
        tipoManejo: "",
        direccionDestino: "",
        documentoAprueba: ""
    });

    const fillFromDestino = (destino) => ({
        razonSocialReceptor: destino?.razonSocial || "",
        rucReceptor: destino?.ruc ? String(destino?.ruc) : "",
        correoReceptor: destino?.correoElectronico || "",
        telefonoReceptor: destino?.telefono || "",
        direccionDestino: destino?.direccion || "",
        documentoAprueba: destino?.codigoRegistroEors || "",
        tipoManejo: ""
    });

    const handleCheckboxChange = (nombre) => {
        setFormData(prev => {
            const otros = prev.otrosManejos || {};
            const destino = prev.destinoId || {};

            if (otros[nombre]) {
                return {
                    ...prev,
                    otrosManejos: {
                        ...clearOtrosManejosFields(),
                        comercializacion: false,
                        exportacion: false,
                        otro: false
                    }
                };
            }

            const nuevosValores = {
                comercializacion: false,
                exportacion: false,
                otro: false,
                [nombre]: true
            };

            const camposAdicionales = nombre === "comercializacion" ? fillFromDestino(destino) : clearOtrosManejosFields();

            return {
                ...prev,
                otrosManejos: {
                    ...prev.otrosManejos,
                    ...nuevosValores,
                    ...camposAdicionales
                }
            };
        });
    };

    // Re-sincronizar si cambia el destinoId mientras comercialización esté activo
    useEffect(() => {
        if (formData.otrosManejos?.comercializacion) {
            setFormData(prev => ({
                ...prev,
                otrosManejos: {
                    ...prev.otrosManejos,
                    ...fillFromDestino(prev.destinoId) // 🛠️ Corregido: antes decía prev.DestinoId con 'D' mayúscula
                }
            }));
        }
    }, [formData.destinoId]);

    return (
        <div className="flex flex-wrap max-md:px-2">
            <Input
                label="EO-RS Destino Final *"
                type="autocomplete"
                name="destinoId"
                value={formData.destinoId}
                setForm={setFormData}
                fetchData="/certificaciones/getDestinosPaginacion"
                setOptions={setDestinoOptions}
                options={destinoOptions}
                field="razonSocial"
                placeholder="Cargando destino final..."
                disabled
                otro={false}
            />

            <Input
                label="Tipo de Manejo *"
                type="select"
                name="tipoManejo"
                value={formData.destinoFinal?.tipoManejo || ""}
                onChange={(e) => handleDestinoChange('tipoManejo', e.target.value)}
                options={tipoManejoOptions}
                placeholder="Seleccionar tipo de manejo"
            />

            <Input
                label="Cantidad entregada (toneladas) *"
                type="number"
                step="0.01"
                value={formData.destinoFinal?.cantidadEntregada || ""}
                onChange={(e) => handleDestinoChange('cantidadEntregada', e.target.value)}
                placeholder="Ej: 15.5"
            />

            <InputNormal
                label="Observaciones"
                value={formData.destinoFinal?.observaciones || ""}
                onChange={(e) => handleDestinoChange('observaciones', e.target.value)}
                placeholder="Observaciones del destino final"
                ancho="w-full"
            />

            <div className="w-full">
                <p className="mx-5 mt-3 text-sm text-slate-600">El referendo de recepción se completa automáticamente cuando el destino aprueba el manifiesto.</p>

                <div className="w-full mt-4 border-t border-gray-300 pt-4">
                    <span className="text-lg font-semibold">Otros Manejos</span>
                    <div className="flex gap-8 mt-3">
                        <div className="flex items-center mt-2">
                            <input
                                type="checkbox"
                                checked={formData.otrosManejos?.comercializacion || false}
                                onChange={() => handleCheckboxChange('comercializacion')}
                                className="h-5 w-5 text-[#285598] focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-600">Comercialización</span>
                        </div>

                        <div className="flex items-center mt-2">
                            <input
                                type="checkbox"
                                checked={formData.otrosManejos?.exportacion || false}
                                onChange={() => handleCheckboxChange('exportacion')}
                                className="h-5 w-5 text-[#285598] focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-600">Exportación</span>
                        </div>

                        <div className="flex items-center mt-2">
                            <input
                                type="checkbox"
                                checked={formData.otrosManejos?.otro || false}
                                onChange={() => handleCheckboxChange('otro')}
                                className="h-5 w-5 text-[#285598] focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-600">Otro</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 mt-4 bg-gray-50 rounded-lg">
                    <Input
                        label="Razón Social del Receptor"
                        value={formData.otrosManejos?.razonSocialReceptor || ""}
                        onChange={(e) => handleOtrosManejosChange('razonSocialReceptor', e.target.value.toUpperCase())}
                        placeholder="Razón social del receptor"
                    />

                    <Input
                        label="RUC del Receptor"
                        type="text"
                        value={formData.otrosManejos?.rucReceptor || ""}
                        onChange={(e) => handleOtrosManejosChange('rucReceptor', e.target.value)}
                        placeholder="RUC"
                    />

                    <Input
                        label="Correo Electrónico"
                        type="email"
                        value={formData.otrosManejos?.correoReceptor || ""}
                        onChange={(e) => handleOtrosManejosChange('correoReceptor', e.target.value.toLowerCase())}
                        placeholder="correo@ejemplo.com"
                    />

                    <Input
                        label="Teléfono"
                        type="text"
                        value={formData.otrosManejos?.telefonoReceptor || ""}
                        onChange={(e) => handleOtrosManejosChange('telefonoReceptor', e.target.value)}
                        placeholder="Teléfono"
                    />

                    <Input
                        label="Tipo de Manejo Realizado"
                        value={formData.otrosManejos?.tipoManejo || ""}
                        onChange={(e) => handleOtrosManejosChange('tipoManejo', e.target.value.toUpperCase())}
                        placeholder="Especifique el tipo de manejo"
                        ancho="w-full"
                    />

                    <Input
                        label="Dirección de Destino / País"
                        value={formData.otrosManejos?.direccionDestino || ""}
                        onChange={(e) => handleOtrosManejosChange('direccionDestino', e.target.value.toUpperCase())}
                        placeholder="Dirección o país de destino"
                        ancho="w-full"
                    />

                    <Input
                        label="Documento que Aprueba"
                        value={formData.otrosManejos?.documentoAprueba || ""}
                        onChange={(e) => handleOtrosManejosChange('documentoAprueba', e.target.value.toUpperCase())}
                        placeholder="N° de resolución o documento"
                        ancho="w-full"
                    />
                </div>
            </div>
        </div>
    );
};

export default Paso5_Destino;
