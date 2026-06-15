import { useState, useEffect } from "react";
import Input from "../../../ui/inputs/Input";
import InputNormal from "../../../ui/inputs/Normal";

const Paso5_Destino = ({ formData, setFormData }) => {
    console.log("Datos del paso 5 - Destino:", formData);
    const [destinoOptions, setDestinoOptions] = useState([]);
    const tipoManejoOptions = ["TRATAMIENTO", "DISPOSICIÓN FINAL", "VALORIZACIÓN"];
    const [responsableOptions, setResponsableOptions] = useState([]);
    const [referendoForm, setReferendoForm] = useState({
        responsableEorsDestino: "",
        fechaReferendo: "",
        horaReferendo: ""
    });
    const handleDestinoChange = (campo, valor) => {
        setFormData(prev => ({
            ...prev,
            destinoFinal: {
                ...prev.destinoFinal,
                [campo]: valor
            }
        }));
    };
    useEffect(() => {
        // Si el referendo se desactiva, limpiar los campos relacionados
        if (!formData.referendoRecepcion?.referendo) {
            setReferendoForm({
                responsableEorsDestino: "",
                fechaReferendo: "",
                horaReferendo: ""
            });
        }
    }, [formData.referendoRecepcion?.referendo]);
    useEffect(() => {
        if (destinoOptions.length > 0) {
            setFormData(prev => ({
                ...prev,
                destinoId: prev.destinoId || destinoOptions[0]
            }));
        }
    }, [destinoOptions]);
    useEffect(() => {
        // Si el referendo se activa, cargar opciones de responsables EO-RS
        if (formData.referendoRecepcion?.referendo) {
            const destinoId = formData.destinoId;
            if (destinoId) {
                setResponsableOptions(destinoId.responsables)
            } else {
                setResponsableOptions([]);
            }
        }
    }, [formData.referendoRecepcion?.referendo, formData.destinoId]);

    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            referendoRecepcion: {
                ...prev.referendoRecepcion,
                responsableEorsDestino: referendoForm.responsableEorsDestino?.nombre || '',
                firmaGenerador: referendoForm.responsableEorsDestino?.firma || '',
                dniResponsableEorsDestino: referendoForm.responsableEorsDestino?.dni || '',
                cargoResponsableEorsDestino: referendoForm.responsableEorsDestino?.cargo || '',
                fechaReferendo: referendoForm.fechaReferendo || '',
                horaReferendo: referendoForm.horaReferendo || ''
            }
        }));
    }, [referendoForm.responsableEorsDestino, referendoForm.fechaReferendo, referendoForm.horaReferendo]);

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

    // Función para llenar los campos desde DestinoId
    const fillFromDestino = (destino) => ({
        razonSocialReceptor: destino?.razonSocial || "",
        rucReceptor: destino?.ruc || "",
        correoReceptor: destino?.correoElectronico || "",
        telefonoReceptor: destino?.telefono || "",
        direccionDestino: destino?.direccion || "",
        documentoAprueba: destino?.codigoRegistroEors || "",
        // Estos campos no se llenan automáticamente
        tipoManejo: ""
    });

    const handleCheckboxChange = (nombre) => {
        setFormData(prev => {
            const otros = prev.otrosManejos || {};
            const destino = prev.destinoId || {};

            // Si el checkbox clickeado ya estaba activo, lo desactivamos y limpiamos campos
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

            // Si no estaba activo, lo activamos y desactivamos los otros
            const nuevosValores = {
                comercializacion: false,
                exportacion: false,
                otro: false,
                [nombre]: true
            };

            // Según cuál se activó, llenamos o limpiamos campos
            let camposAdicionales = {};
            if (nombre === "comercializacion") {
                camposAdicionales = fillFromDestino(destino);
            } else {
                // exportacion u otro: limpiamos campos
                camposAdicionales = clearOtrosManejosFields();
            }

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

    // Efecto para actualizar campos si transportistaId cambia mientras comercializacion está activo
    useEffect(() => {
        if (formData.otrosManejos?.comercializacion) {
            setFormData(prev => ({
                ...prev,
                otrosManejos: {
                    ...prev.otrosManejos,
                    ...fillFromDestino(prev.DestinoId)
                }
            }));
        }
    }, [formData.destinoId]);

    return (
        <div className="flex flex-wrap">
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
                placeholder="Buscar destino por RUC o razón social"
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

            <div className="flex flex-col items-start ml-5 gap-1">
                <span className=" text-md text-gray-600">Referendo</span>
                <input
                    type="checkbox"
                    checked={formData.referendoRecepcion?.referendo || false}
                    onChange={(e) => setFormData(prev => ({
                        ...prev,
                        referendoRecepcion: {
                            ...prev.referendoRecepcion,
                            referendo: e.target.checked
                        }
                    }))}
                    className="h-6 w-10 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
            </div>
            <div className="w-full ">
                {formData.referendoRecepcion?.referendo && (
                    <div className="flex flex-col mt-4  pt-4 border-t gap-4 ">
                        <div className="flex flex-wrap">
                            <Input
                                label="Responsable EO-RS del destino final"
                                type="select"
                                name="responsableEorsDestino"
                                options={responsableOptions}
                                setForm={setReferendoForm}
                                optionLabel="nombre"
                                value={referendoForm.responsableEorsDestino || ""}
                                placeholder="Nombre del responsable EO-RS del destino final"
                                ancho="w-full"
                            />
                            <Input
                                label="DNI"
                                value={referendoForm.responsableEorsDestino?.dni || ""}
                                setForm={setReferendoForm}
                                placeholder="DNI del responsable EO-RS del destino final"
                            />
                            <Input
                                label="Cargo"
                                value={referendoForm.responsableEorsDestino?.cargo || ""}
                                setForm={setReferendoForm}
                                placeholder="Cargo del responsable EO-RS del destino final"
                            />
                            <Input
                                label="Fecha"
                                type="date"
                                ancho="!min-w-40"
                                name="fechaReferendo"
                                value={referendoForm.fechaReferendo || ""}
                                setForm={setReferendoForm}
                                placeholder="Fecha"
                            />
                            <InputNormal
                                label="Hora"
                                type="time"
                                ancho="!min-w-40"
                                name="horaReferendo"
                                value={referendoForm.horaReferendo || ""}
                                setForm={setReferendoForm}
                                placeholder="Hora"
                            />
                        </div>
                    </div>
                )}
                <div className="w-full mt-4 border-t pt-4 ">
                    <span className="text-lg font-semibold">Otros Manejos</span>
                    <div className="flex gap-8 mt-3">
                        <div className="flex items-center mt-2">
                            <input
                                type="checkbox"
                                checked={formData.otrosManejos?.comercializacion || false}
                                onChange={(e) => handleCheckboxChange('comercializacion', e.target.checked)}
                                className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-600">Comercialización</span>
                        </div>

                        <div className="flex items-center mt-2">
                            <input
                                type="checkbox"
                                checked={formData.otrosManejos?.exportacion || false}
                                onChange={(e) => handleCheckboxChange('exportacion', e.target.checked)}
                                className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-600">Exportación</span>
                        </div>

                        <div className="flex items-center mt-2">
                            <input
                                type="checkbox"
                                checked={formData.otrosManejos?.otro || false}
                                onChange={(e) => handleCheckboxChange('otro', e.target.checked)}
                                className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-600">Otro</span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-wrap gap-4 mt-4  bg-gray-50 rounded-lg">
                    <Input
                        label="Razón Social del Receptor"
                        onChange={(e) => handleOtrosManejosChange('razonSocialReceptor', e.target.value.toUpperCase())}
                        placeholder="Razón social del receptor"
                        value={formData.otrosManejos?.razonSocialReceptor || ""}
                    />

                    <Input
                        label="RUC del Receptor"
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
        </div >
    );
};

export default Paso5_Destino;