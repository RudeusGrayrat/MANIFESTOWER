import { useEffect, useState } from "react";
import Input from "../../../ui/inputs/Input";
import InputNormal from "../../../ui/inputs/Normal";

const Paso4_Transporte = ({ formData, setFormData }) => {
    const [formReferendo, setFormReferendo] = useState(formData.referendoEntrega || {
        generadorResponsableManejo: "",
        responsableEors: "",
        fechaRecepcion: formData.transporte?.fechaRecepcion || "",
    });
    const [transportistaOptions, setTransportistaOptions] = useState([]);
    const [conductoresOptions, setConductoresOptions] = useState([]);
    const [responsableGeneradorOptions, setResponsableGeneradorOptions] = useState([]);
    const [responsableEORSOptions, setResponsableEORSOptions] = useState([]);

    const handleTransporteChange = (campo, valor) => {
        setFormData(prev => ({
            ...prev,
            transporte: {
                ...prev.transporte,
                [campo]: valor
            }
        }));
    };
    useEffect(() => {
        if (formData.transportistaId) {
            const transportistaSeleccionado = formData?.transportistaId;
            const conductores = transportistaSeleccionado?.conductores || [];
            const allConductores = conductores?.map(c => c.nombre)
            setConductoresOptions(allConductores);
        }
    }, [formData.transportistaId]);
    useEffect(() => {
        if (formData.referendoEntrega?.referendo === false) {
            setFormReferendo({
                generadorResponsableManejo: "",
                responsableEors: "",
                fechaRecepcion: "",
            });
            setFormData(prev => ({
                ...prev,
                referendoEntrega: {
                    generadorResponsableManejo: "",
                    firmaGenerador: "",
                    responsableEors: "",
                    firmaResponsableEors: "",
                    dniResponsableEors: "",
                    cargoResponsableEors: "",
                    fechaRecepcion: "",
                    horaRecepcion: "",
                }
            }));
        }
    }, [formData.referendoEntrega?.referendo]);
    useEffect(() => {
        if (Object.keys(formData.generadorId).length > 0) {
            const responsablesGenerador = formData.generadorId.responsablesTecnicos
            if (responsablesGenerador.length > 0) {
                setResponsableGeneradorOptions(responsablesGenerador);
            } else {
                setResponsableGeneradorOptions([]);
            }
        }
    }, [formData.generadorId]);
    useEffect(() => {
        if (formData.transportistaId) {
            const responsablesEORS = formData.transportistaId?.responsables
            if (responsablesEORS.length > 0) {
                setResponsableEORSOptions(responsablesEORS);
            } else {
                setResponsableEORSOptions([]);
            }
        }

    }, [formData.transportistaId]);

    useEffect(() => {
        if (formReferendo.generadorResponsableManejo && formReferendo.responsableEors) {
            setFormData(prev => ({
                ...prev,
                referendoEntrega: {
                    generadorResponsableManejo: formReferendo.generadorResponsableManejo.nombreResponsable,
                    firmaGenerador: formReferendo.generadorResponsableManejo.firmaResponsable || "",
                    responsableEors: formReferendo.responsableEors.nombre,
                    firmaResponsableEors: formReferendo.responsableEors.firmaResponsable || "",
                    dniResponsableEors: formReferendo.responsableEors.dni,
                    cargoResponsableEors: formReferendo.responsableEors.cargo,
                    fechaRecepcion: formReferendo.fechaRecepcion,
                    referendo: formData.referendoEntrega?.referendo || false,
                }
            }));
        }
    }, [formReferendo.generadorResponsableManejo, formReferendo.responsableEors]);
    return (
        <div className="gap-4">
            <div className="flex flex-wrap">
                <Input
                    label="EO-RS Transportista *"
                    type="autocomplete"
                    name="transportistaId"
                    value={formData.transportistaId}
                    setForm={setFormData}
                    fetchData="/certificaciones/getTransportistasPaginacion"
                    setOptions={setTransportistaOptions}
                    options={transportistaOptions}
                    field="razonSocial"
                    placeholder="Buscar transportista por RUC o razón social"
                    disabled
                />

                <Input
                    label="Nombre del conductor *"
                    type="select"
                    value={formData.transporte?.nombreConductor || ""}
                    options={conductoresOptions}
                    onChange={(e) => handleTransporteChange('nombreConductor', e.target.value.toUpperCase())}
                    placeholder="Nombres y apellidos del conductor"
                />

                <Input
                    label="Tipo de vehículo *"
                    value={formData.transporte?.tipoVehiculo || ""}
                    onChange={(e) => handleTransporteChange('tipoVehiculo', e.target.value.toUpperCase())}
                    placeholder="Ej: CAMIÓN, CISTERNA"
                />

                <Input
                    label="Placa del vehículo *"
                    value={formData.transporte?.placaVehiculo || ""}
                    onChange={(e) => handleTransporteChange('placaVehiculo', e.target.value.toUpperCase())}
                    placeholder="Ej: ABC-123"
                />

                <Input
                    label="Fecha de recepción *"
                    type="date"
                    value={formData.transporte?.fechaRecepcion || ""}
                    onChange={(e) => handleTransporteChange('fechaRecepcion', e.target.value)}
                />

                <Input
                    label="Cantidad recibida (toneladas) *"
                    type="number"
                    step="0.01"
                    value={formData.transporte?.cantidadRecibida || ""}
                    onChange={(e) => handleTransporteChange('cantidadRecibida', e.target.value)}
                    placeholder="Ej: 15.5"
                />

                <InputNormal
                    label="Observaciones"
                    value={formData.transporte?.observaciones || ""}
                    onChange={(e) => handleTransporteChange('observaciones', e.target.value)}
                    placeholder="Observaciones del transporte"
                    ancho="w-full"
                />

            </div>
            <div className="flex flex-col gap-4 mt-4">
                <div className="flex items-center mt-4 m-2">
                    <input
                        type="checkbox"
                        checked={formData.referendoEntrega?.referendo || false}
                        onChange={(e) =>
                            setFormData(prev => ({
                                ...prev,
                                referendoEntrega: {
                                    ...prev.referendoEntrega,
                                    referendo: e.target.checked
                                }
                            }))
                        }
                        className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-md text-gray-600">Referendo</span>
                </div>
                {formData.referendoEntrega?.referendo && (
                    <div className="flex flex-wrap">

                        <Input
                            label="Generador - Responsable del manejo"
                            type="select"
                            name="generadorResponsableManejo"
                            options={responsableGeneradorOptions}
                            value={formReferendo.generadorResponsableManejo}
                            setForm={setFormReferendo}
                            optionLabel="nombreResponsable"
                            placeholder="Nombre del generador - responsable del manejo"
                            ancho="w-full"
                        />
                        <Input
                            label="Responsable EORS"
                            type="select"
                            name="responsableEors"
                            options={responsableEORSOptions}
                            value={formReferendo.responsableEors}
                            setForm={setFormReferendo}
                            optionLabel="nombre"
                            placeholder="Nombre del responsable EORS"
                            ancho="w-full"
                        />
                        <Input
                            label="DNI del responsable EORS"
                            value={formReferendo.responsableEors?.dni || ""}
                            placeholder="DNI del responsable EORS"
                            ancho="w-full"
                            disabled
                        />
                        <Input
                            label="Cargo del responsable EORS"
                            value={formReferendo.responsableEors?.cargo || ""}
                            placeholder="Cargo del responsable EORS"
                            disabled
                            ancho="w-full"
                        />
                        <Input
                            label="Fecha"
                            type="date"
                            name="fechaRecepcion"
                            value={formData.transporte?.fechaRecepcion || ""}
                            ancho="!min-w-40"
                            disabled
                        />
                        <InputNormal
                            label="Hora"
                            type="time"
                            name="horaRecepcion"
                            value={formData.transporte?.horaRecepcion || ""}
                            onChange={(e) => handleTransporteChange('horaRecepcion', e.target.value)}
                            ancho="!min-w-32"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Paso4_Transporte;