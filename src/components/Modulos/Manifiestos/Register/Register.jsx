import { useState } from "react";
import CardPlegable from "../../../ui/cards/CardPlegable";
import Paso1_DatosGenerales from "./DatosGenerales";
import Paso2_Residuo from "./Residuo";
import Paso3_Peligrosidad from "./Peligrosidad";
import axios from "../../../api/axios";
import { useAuth } from "../../../context/AuthContext";
import { ProgressBar } from "primereact/progressbar";
import Paso4_Transporte from "./Transporte";
import Paso5_Destino from "./Destino";
import Paso6_OtrasObligaciones from "./OtrasObligaciones";
import dayjs from "dayjs";
import ButtonOk from "../../../ui/Buttons/Buttons";
import { useToast } from "../../../notificaciones/ToastContext";

const RegisterManifiestos = ({ formEdit, setFormEdit, editUpdate, editCancel }) => {

    const [deshabilitar, setDeshabilitar] = useState(false);
    const [pasoActual, setPasoActual] = useState(1);
    const { user } = useAuth();
    const { showInfo, showSuccess, showError, showWarning } = useToast();
    const [formData, setFormData] = useState({
        // Autogenerado
        año: new Date().getFullYear(),
        mes: dayjs().locale("es").format("MMMM"),
        //PASO1 Datos Generales
        transportistaId: '',
        generadorId: '',
        planta: '',
        responsableGestion: "",
        //PASO2 datos del residuo
        residuo: {
            descripcion: '',
            cantidadTotal: '',
            estadoFisico: '',
            tipoRecipiente: '',
            materialRecipiente: '',
            numeroRecipientes: "",
            codigoBasilea: '',
            subcodigoBasilea: '',
            informacionAdicional: '',
        },
        peligrosidad: {
            explosivos: false, oxidantes: false, gasesToxicos: false,
            liquidosInflamables: false, peroxidosOrganicos: false,
            toxicosCronicos: false, solidosInflamables: false,
            toxicosAgudos: false, ecotoxicos: false,
            combustionEspontanea: false, sustanciasInfecciosas: false,
            sustanciasSecundarias: false, gasesInflamablesAgua: false,
            corrosivos: false, otros: ''
        },
        //PASO3 Manejo del residuo
        transporte: {
            nombreConductor: '',
            fechaRecepcion: '', cantidadRecibida: '', observaciones: '', tipoVehiculo: '', placaVehiculo: ''
        },
        referendoEntrega: { referendo: false, generadorResponsableManejo: '', firmaGenerador: '', responsableEors: '', firmaResponsableEors: '', dniResponsableEors: '', cargoResponsableEors: '', fechaHora: '' },
        //3.2 EoRs del Destino final
        destinoId: '',
        destinoFinal: { tipoManejo: "", cantidadEntregada: '', observaciones: '' },
        referendoRecepcion: {
            referendo: false,
            responsableEorsDestino: '',
            firmaGenerador: '',
            dniResponsableEorsDestino: '',
            cargoResponsableEorsDestino: '',
            fechaReferendo: '',
            horaReferendo: ''
        },
        //3.3 Otros
        otrosManejos: {
            razonSocialReceptor: '',
            rucReceptor: '',
            correoReceptor: '',
            telefonoReceptor: '',
            comercializacion: false,
            exportacion: false,
            otro: false,
            tipoManejo: '',
            direccionDestino: '',
            documentoAprueba: '',
        },
        //PASO4 Otras obligaciones
        //representante de la eo
        otrasObligaciones: {
            representanteEors: '', cargoRepresentanteEors: '', dniRepresentanteEors: '', firmaRepresentanteEors: '',
            //datos del generador responsable del manejo
            generadorResponsableManejo: '', cargoGeneradorResponsableManejo: '', dniGeneradorResponsableManejo: '', firmaGeneradorResponsableManejo: '', fecha: '', hora: ''
        },

        estado: 'BORRADOR'
    });

    const pasos = [
        { id: 1, nombre: "Datos generales", componente: Paso1_DatosGenerales },
        { id: 2, nombre: "Residuos peligroso", componente: Paso2_Residuo },
        { id: 3, nombre: "Características de peligrosidad", componente: Paso3_Peligrosidad },
        { id: 4, nombre: "Transporte", componente: Paso4_Transporte },
        { id: 5, nombre: "Destino final", componente: Paso5_Destino },
        { id: 6, nombre: "Otras obligaciones", componente: Paso6_OtrasObligaciones },
    ];

    const dataEnvioActual = formEdit ? formEdit : formData;
    const setDataActual = formEdit ? setFormEdit : setFormData;

    const resetForm = () => {
        setFormData({
            año: new Date().getFullYear(),
            mes: new Date().getMonth() + 1,
            transportistaId: '',
            generadorId: '',
            planta: {},
            responsableGestion: "",
            residuo: {
                descripcion: '', cantidadTotal: '', estadoFisico: '', tipoRecipiente: '',
                materialRecipiente: '', numeroRecipientes: 1, codigoBasilea: '',
                subcodigoBasilea: '', informacionAdicional: ''
            },
            peligrosidad: {
                explosivos: false, oxidantes: false, gasesToxicos: false, liquidosInflamables: false,
                peroxidosOrganicos: false, toxicosCronicos: false, solidosInflamables: false,
                toxicosAgudos: false, ecotoxicos: false, combustionEspontanea: false,
                sustanciasInfecciosas: false, sustanciasSecundarias: false, gasesInflamablesAgua: false,
                corrosivos: false, otros: ''
            },
            transporte: {
                nombreConductor: "", fechaRecepcion: '', cantidadRecibida: '', observaciones: '',
                tipoVehiculo: '', placaVehiculo: '', horaRecepcion: ''
            },
            referendoEntrega: { referendo: false, generadorResponsableManejo: '', firmaGenerador: '', responsableEors: '', firmaResponsableEors: '', dniResponsableEors: '', cargoResponsableEors: '', fechaHora: '' },
            destinoId: '',
            destinoFinal: { tipoManejo: "", cantidadEntregada: '', observaciones: '' },
            referendoRecepcion: {
                referendo: false, responsableEorsDestino: '', firmaGenerador: '',
                dniResponsableEorsDestino: '', cargoResponsableEorsDestino: '', fechaHora: ''
            },
            otrosManejos: {
                razonSocialReceptor: '', rucReceptor: '', correoReceptor: '', telefonoReceptor: '',
                comercializacion: false, exportacion: false, otro: false, tipoManejo: '',
                direccionDestino: '', documentoAprueba: '',
            },
            otrasObligaciones: {
                representanteEors: '', cargoRepresentanteEors: '', dniRepresentanteEors: '', firmaRepresentanteEors: '',
                generadorResponsableManejo: '', cargoGeneradorResponsableManejo: '', dniGeneradorResponsableManejo: '', firmaGeneradorResponsableManejo: '', fecha: '', hora: ''
            },
            estado: 'BORRADOR'
        });
        setPasoActual(1);
    };

    const register = async () => {
        setDeshabilitar(true);

        try {
            if (!formData.generadorId || !formData.planta) {
                showWarning("Complete los datos del generador y la planta", "Advertencia");
                setPasoActual(1);
                return;
            }
            if (!formData.residuo.descripcion || !formData.residuo.cantidadTotal || !formData.residuo.estadoFisico) {
                showInfo(`Complete los datos del residuo: ${!formData.residuo.descripcion ? 'Descripción, ' : ''}${!formData.residuo.cantidadTotal ? 'Cantidad total, ' : ''}${!formData.residuo.estadoFisico ? 'Estado físico' : ''}`);
                setPasoActual(2);
                return;
            }
            if (!formData.transportistaId || !formData.transporte.fechaRecepcion) {
                showWarning("Complete los datos de transporte");
                setPasoActual(4);
                return;
            }
            if (!formData.destinoId) {
                showWarning("Seleccione el destino final");
                setPasoActual(5);
                return;
            }

            const datosEnvio = {
                ...formData,
                generadorId: formData.generadorId?._id || formData.generadorId,
                transportistaId: formData.transportistaId?._id || formData.transportistaId,
                destinoId: formData.destinoId?._id || formData.destinoId,
                creadoPor: user._id
            };
            const response = await axios.post("/certificaciones/postManifiesto", datosEnvio);
            const data = response.data;

            showSuccess(data.message);

            if (data.type === "Correcto") {
                resetForm();
            }
        } catch (error) {
            showError(error.response?.data?.message || "Error al registrar manifiesto");
        } finally {
            setDeshabilitar(false);
        }
    };

    return (
        <div className="w-full p-4">
            {/* Barra de progreso */}
            <div className="mb-4 mx-4">
                <ProgressBar
                    style={{ borderRadius: "20px" }}
                    value={parseFloat(((pasoActual / pasos.length) * 100).toFixed(0))}
                />
            </div>

            {/* Paso actual - Mapeado paralelo */}
            <CardPlegable title={` ${pasos[pasoActual - 1].nombre}`}>
                {pasos.map((paso) => {
                    const Componente = paso.componente;
                    return (
                        <div
                            key={paso.id}
                            className={pasoActual === paso.id ? "block" : "hidden"}
                        >
                            <Componente
                                user={user}
                                formData={dataEnvioActual}
                                setFormData={setDataActual}
                            />
                        </div>
                    );
                })}
            </CardPlegable>

            {/* Botones de navegación */}
            <div className="flex justify-between mt-6">
                <ButtonOk
                    children="Anterior"
                    classe="!w-32"
                    onClick={() => setPasoActual(prev => Math.max(1, prev - 1))}
                    disabled={pasoActual === 1 || deshabilitar}
                />
                <div className="flex space-x-4">
                    <ButtonOk
                        children="Cancelar"
                        classe="!w-32"
                        onClick={editCancel !== null ? editCancel : resetForm}
                        disabled={deshabilitar}
                    />
                    {pasoActual < pasos.length ? (
                        <ButtonOk
                            type="ok"
                            children="Siguiente"
                            classe="!w-32"
                            onClick={() => setPasoActual(prev => prev + 1)}
                        />
                    ) : (
                        <ButtonOk
                            type="ok"
                            children={editUpdate ? "Actualizar" : "Registrar"}
                            classe="!w-32"
                            onClick={editUpdate ? editUpdate : register}
                            disabled={deshabilitar}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default RegisterManifiestos;