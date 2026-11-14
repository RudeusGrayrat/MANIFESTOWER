import { useEffect, useState } from "react";
import Input from "../../../ui/inputs/Input";
import InputNormal from "../../../ui/inputs/Normal";

const fechaActualLima = () => {
    const partes = new Intl.DateTimeFormat("en-US", { timeZone: "America/Lima", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date());
    const valor = (tipo) => partes.find((parte) => parte.type === tipo)?.value;
    return `${valor("year")}-${valor("month")}-${valor("day")}`;
};

const Paso4_Transporte = ({ formData, setFormData }) => {
    const fechaMinima = fechaActualLima();
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

    // 1. Cargar conductores del transportista
    useEffect(() => {
        if (formData.transportistaId) {
            const transportistaSeleccionado = formData?.transportistaId;
            const conductores = transportistaSeleccionado?.conductores || [];
            const allConductores = conductores?.map(c => c.nombre);
            setConductoresOptions(allConductores);
        }
    }, [formData.transportistaId]);

    // 2. El refrendo es obligatorio: si no había una elección previa, se usa
    // el primer responsable configurado. El usuario puede elegir otro.
    useEffect(() => {
        if (formData.generadorId && Object.keys(formData.generadorId).length > 0) {
            const responsablesGenerador = formData.generadorId.responsablesTecnicos || [];
            setResponsableGeneradorOptions(responsablesGenerador);

            // Si es un string inicial, buscamos su objeto para inicializar correctamente el select
            if (typeof formReferendo.generadorResponsableManejo === 'string' && formReferendo.generadorResponsableManejo) {
                const encontrado = responsablesGenerador.find(r => r.nombreResponsable === formReferendo.generadorResponsableManejo);
                if (encontrado) {
                    setFormReferendo(prev => ({ ...prev, generadorResponsableManejo: encontrado }));
                }
            } else if (!formReferendo.generadorResponsableManejo && responsablesGenerador.length) {
                setFormReferendo(prev => ({ ...prev, generadorResponsableManejo: responsablesGenerador[0] }));
            }
        }
    }, [formData.generadorId]);

    // 4. Opciones Responsable EORS + Vinculación de Objeto Inicial
    useEffect(() => {
        if (formData.transportistaId) {
            const responsablesEORS = formData.transportistaId?.responsables || [];
            setResponsableEORSOptions(responsablesEORS);

            // Si es un string inicial, buscamos su objeto para inicializar correctamente el select
            if (typeof formReferendo.responsableEors === 'string' && formReferendo.responsableEors) {
                const encontrado = responsablesEORS.find(r => r.nombre === formReferendo.responsableEors);
                if (encontrado) {
                    setFormReferendo(prev => ({ ...prev, responsableEors: encontrado }));
                }
            } else if (!formReferendo.responsableEors && responsablesEORS.length) {
                setFormReferendo(prev => ({ ...prev, responsableEors: responsablesEORS[0] }));
            }
        }
    }, [formData.transportistaId]);

    // 5. Sincronización SEGURA hacia el formData global (Evita sobreescrituras con undefined)
    useEffect(() => {
        const gen = formReferendo.generadorResponsableManejo;
        const eors = formReferendo.responsableEors;

        setFormData(prev => {
            const nuevoReferendo = {
                ...prev.referendoEntrega,
                referendo: true,
            };

            // Procesar Generador de forma segura
            if (gen) {
                if (typeof gen === 'object' && gen.nombreResponsable) {
                    nuevoReferendo.generadorResponsableManejo = gen.nombreResponsable;
                    nuevoReferendo.firmaGenerador = gen.firmaResponsable || "";
                } else if (typeof gen === 'string') {
                    nuevoReferendo.generadorResponsableManejo = gen;
                }
            }

            // Procesar Responsable EORS de forma segura
            if (eors) {
                if (typeof eors === 'object' && eors.nombre) {
                    nuevoReferendo.responsableEors = eors.nombre;
                    nuevoReferendo.firmaResponsableEors = eors.firmaResponsable || "";
                    nuevoReferendo.dniResponsableEors = eors.dni || "";
                    nuevoReferendo.cargoResponsableEors = eors.cargo || "";
                } else if (typeof eors === 'string') {
                    nuevoReferendo.responsableEors = eors;
                }
            }

            if (formReferendo.fechaRecepcion) {
                nuevoReferendo.fechaRecepcion = formReferendo.fechaRecepcion;
            }

            // Evitar bucles infinitos de renderizado si el objeto no ha cambiado realmente
            if (JSON.stringify(prev.referendoEntrega) === JSON.stringify(nuevoReferendo)) {
                return prev;
            }

            return {
                ...prev,
                referendoEntrega: nuevoReferendo
            };
        });
    }, [formReferendo.generadorResponsableManejo, formReferendo.responsableEors, formReferendo.fechaRecepcion]);

    return (
        <div className="gap-2 max-md:px-8">
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
                    min={fechaMinima}
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
                <div className="m-2">
                    <h3 className="text-md font-semibold text-slate-800">Referendo de entrega</h3>
                    <p className="text-sm text-slate-500">Obligatorio. Las firmas se congelan al enviar el manifiesto.</p>
                </div>
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
                            value={formReferendo.responsableEors?.dni || formData.referendoEntrega?.dniResponsableEors || ""}
                            placeholder="DNI del responsable EORS"
                            ancho="w-full"
                            disabled
                        />

                        <Input
                            label="Cargo del responsable EORS"
                            value={formReferendo.responsableEors?.cargo || formData.referendoEntrega?.cargoResponsableEors || ""}
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
            </div>
        </div>
    );
};

export default Paso4_Transporte;
