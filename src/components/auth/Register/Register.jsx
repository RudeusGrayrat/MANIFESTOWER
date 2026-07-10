import React, { useState } from "react";
import axios from "../../../components/api/axios";

// Componentes Reutilizables Comunes
import Directorio from "../../../components/ui/cards/Directorio";

// Submódulos de Generador
import DatosBasicosGenerador from "./generador/DatosBasicos";
import DatosPlanta from "./generador/DatosPlanta";
import ResponsableGenerador from "./generador/Responsable";

// Submódulos de Transportista
import DatosBasicosTransportista from "./transportista/DatosBasicos";
import RepresentanteYResponsable from "./transportista/Representante_y_Responsable";
import Contingencias from "./transportista/Contingencias";
import ResponsablesTransportista from "./transportista/Responsables";
import GeneradoresTransportistas from "./transportista/Generadores";
import Conductores from "./transportista/Conductores";
import ButtonOk from "../../ui/Buttons/Buttons";
import { Link } from "react-router";

const Register = () => {
  const [errorValidacion, setErrorValidacion] = useState("");

  // Control del flujo de pasos y tipo de perfil
  const [step, setStep] = useState(0);
  const [tipoUsuario, setTipoUsuario] = useState("");

  // Estados para controlar el panel informativo final
  const [mostrarExito, setMostrarExito] = useState(false);
  const [infoRegistro, setInfoRegistro] = useState({ ruc: "", razonSocial: "", tipo: "" });

  // 1. ESTADO DE GENERADOR
  const [formGenerador, setFormGenerador] = useState({
    razonSocial: "",
    ruc: "",
    correoElectronico: "",
    telefono: "",
    representanteLegal: "",
    dniRepresentante: "",
    plantas: [],
    responsablesTecnicos: [],
    crearUsuario: true
  });

  // 2. ESTADO DE TRANSPORTISTA
  const [formTransportista, setFormTransportista] = useState({
    razonSocial: '',
    ruc: '',
    registroEors: '',
    autorizacionMunicipal: '',
    documentoRuta: '',
    direccion: '',
    ubigeoId: '',
    correoElectronico: '',
    telefono: '',
    representanteLegal: { nombre: '', dni: '' },
    responsableTecnico: { nombre: '', numeroColegiatura: '' },
    responsables: [],
    contingencias: { derrame: '', infiltracion: '', incendio: '', explosion: '', otros: '' },
    generadores: [],
    conductores: [],
    crearUsuario: true
  });

  const totalPasos = tipoUsuario === "TRANSPORTISTA" ? 6 : 3;

  const validarPasoActual = () => {
    setErrorValidacion("");
    if (tipoUsuario === "GENERADOR") {
      if (step === 1) {
        if (!formGenerador.razonSocial || !formGenerador.ruc || !formGenerador.correoElectronico || !formGenerador.telefono) {
          setErrorValidacion("Faltan completar campos básicos obligatorios.");
          return false;
        }
      }
      if (step === 2 && formGenerador.plantas.length === 0) {
        setErrorValidacion("Debe agregar al menos una planta en el directorio.");
        return false;
      }
    } else if (tipoUsuario === "TRANSPORTISTA") {
      if (step === 1) {
        if (!formTransportista.razonSocial || !formTransportista.ruc || !formTransportista.direccion || !formTransportista.correoElectronico) {
          setErrorValidacion("Faltan completar campos básicos del transportista.");
          return false;
        }
      }
    }
    return true;
  };

  const handleSiguiente = () => {
    if (validarPasoActual()) {
      setStep((prev) => prev + 1);
    }
  };

  const handleAtras = () => {
    setErrorValidacion("");
    if (step === 1) {
      setStep(0);
      setTipoUsuario("");
    } else {
      setStep((prev) => prev - 1);
    }
  };

  // ENVÍO FINAL DE DATOS A LA API
  const ejecutarRegistroFinal = async () => {
    setErrorValidacion("");

    try {
      let rucRegistrado = "";
      let razonSocialRegistrada = "";

      if (tipoUsuario === "GENERADOR") {
        if (formGenerador.responsablesTecnicos.length === 0) {
          setErrorValidacion("Debe agregar al menos un responsable técnico.");
          return;
        }
        rucRegistrado = formGenerador.ruc;
        razonSocialRegistrada = formGenerador.razonSocial;
        await axios.post("/certificaciones/postGenerador", formGenerador);
      } else {
        rucRegistrado = formTransportista.ruc;
        razonSocialRegistrada = formTransportista.razonSocial;
        await axios.post("/certificaciones/postTransportista", formTransportista);
      }

      // Guardamos la información capturada para el resumen antes de limpiar los estados
      setInfoRegistro({
        ruc: rucRegistrado,
        razonSocial: razonSocialRegistrada,
        tipo: tipoUsuario
      });

      setMostrarExito(true);

      // Limpiamos los flujos de pasos y selección
      setStep(0);
      setTipoUsuario("");
    } catch (error) {
      setErrorValidacion(error.response?.data?.message || "Ocurrió un error inesperado al registrar.");
    }
  };

  // VISTA PANEL DE INDICACIONES DE CREDENCIALES POST-REGISTRO
  if (mostrarExito) {
    return (
      <div className="register-success w-full h-full min-h-0 flex flex-col justify-center items-center px-4 animate-fade-in duration-500">
        <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-gray-100 p-8 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl mb-4 animate-bounce">
            ✓
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">¡Registro Completado Exitosamente!</h2>
          <p className="text-sm text-gray-500 mb-6">
            La empresa <span className="font-semibold text-gray-700">{infoRegistro.razonSocial}</span> ({infoRegistro.tipo}) ha sido dada de alta en el sistema.
          </p>

          {/* Panel Informativo de Accesos */}
          <div className="w-full bg-blue-50 border border-blue-200 rounded-lg p-5 text-left mb-6">
            <h4 className="text-sm font-bold text-blue-950 mb-2 flex items-center gap-2">
              🔑 Indicaciones Importantes de Acceso:
            </h4>
            <p className="text-xs text-blue-800 mb-4 leading-relaxed">
              De acuerdo con las políticas del sistema, se ha configurado de forma automática una cuenta externa vinculada a su organización con las siguientes credenciales predeterminadas:
            </p>

            <div className="text-xs text-gray-700 font-mono space-y-2 bg-white p-4 rounded-md border border-blue-100 shadow-inner">
              <div className="flex justify-between border-b border-gray-100 pb-1">
                <span className="font-bold text-gray-600">Usuario (RUC):</span>
                <span className="text-blue-700 font-bold">{infoRegistro.ruc}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="font-bold text-gray-600">Contraseña Inicial:</span>
                <span className="text-blue-700 font-bold">{infoRegistro.ruc}</span>
              </div>
            </div>

            <p className="text-[11px] text-blue-700 mt-4 italic bg-blue-100/50 p-2 rounded border-l-4 border-blue-400 leading-tight">
              * Nota de seguridad: Su contraseña inicial coincide exactamente con su número de RUC. Es obligatorio que modifique esta contraseña desde el panel de su perfil tras iniciar sesión por primera vez.
            </p>
          </div>

          <button
            //dirigir a la ruta de login "/"
            onClick={() => {
              setMostrarExito(false);
              // Redirigir a la ruta de login "/"
              window.location.href = "/login";
            }}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors shadow-md text-sm cursor-pointer"
          >
            Entendido, ir al Inicio de Sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="register-content w-full h-full min-h-0 flex flex-col justify-center items-center relative animate-fade-in duration-500">
      <div className="register-card w-full h-full min-h-0 bg-white rounded-xl border border-gray-100 p-6 pb-2! md:p-8 transition-all duration-300 flex flex-col">

        {/* INDICADOR DE PROGRESO VISUAL */}
        {step > 0 && (
          <div className="w-full mb-6">
            <div className="flex justify-between items-center text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              <span>Perfil: {tipoUsuario}</span>
              <span>Paso {step} de {totalPasos}</span>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${tipoUsuario === "GENERADOR" ? 'bg-blue-600' : 'bg-green-600'}`}
                style={{ width: `${(step / totalPasos) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* BANNER DE ERROR LOCAL */}
        {errorValidacion && (
          <div className="w-full mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded text-red-700 text-sm font-medium animate-fade-in">
            ⚠️ {errorValidacion}
          </div>
        )}

        {/* PASO 0: SELECCIÓN DE ROL INICIAL */}
        {step === 0 && (
          <div className="flex flex-col items-center py-6 animate-fade-in">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 text-center mb-2">
              Bienvenido al Registro
            </h2>
            <p className="text-gray-500 text-center mb-8">
              Selecciona tu tipo de actividad para comenzar el formulario guiado.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl ">
              <button
                type="button"
                onClick={() => { setTipoUsuario("GENERADOR"); setStep(1); }}
                className="flex flex-col items-center justify-center p-6 bg-white border-2 border-gray-200 hover:border-blue-500 rounded-xl transition-all shadow-sm hover:shadow-md group text-center cursor-pointer"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🏭</div>
                <span className="text-lg font-bold text-gray-700 group-hover:text-blue-600">Empresa Generadora</span>
              </button>

              <button
                type="button"
                onClick={() => { setTipoUsuario("TRANSPORTISTA"); setStep(1); }}
                className="flex flex-col items-center justify-center p-6 bg-white border-2 border-gray-200 hover:border-green-500 rounded-xl transition-all shadow-sm hover:shadow-md group text-center cursor-pointer"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🚚</div>
                <span className="text-lg font-bold text-gray-700 group-hover:text-green-600">Empresa Transportista</span>
              </button>
            </div>
          </div>
        )}

        {/* FLUJO EXCLUSIVO: GENERADOR (3 Pasos) */}
        {tipoUsuario === "GENERADOR" && (
          <div className="flex-1 flex flex-col min-h-0">
            {step === 1 && (
              <div className="animate-fade-in overflow-y-auto h-full pr-1 custom-scrollbar">
                <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Datos Básicos del Generador</h3>
                <DatosBasicosGenerador form={formGenerador} setForm={setFormGenerador} />
              </div>
            )}
            {step === 2 && (
              <div className="animate-fade-in overflow-y-auto h-full pr-1 custom-scrollbar">
                <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Directorio de Plantas Autorizadas</h3>
                <Directorio
                  ItemComponent={DatosPlanta}
                  setForm={setFormGenerador}
                  directory={formGenerador.plantas}
                  data="plantas"
                  estilos="flex items-center pl-2"
                />
              </div>
            )}
            {step === 3 && (
              <div className="animate-fade-in overflow-y-auto h-full pr-1 custom-scrollbar">
                <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Responsables Técnicos asignados</h3>
                <Directorio
                  ItemComponent={ResponsableGenerador}
                  setForm={setFormGenerador}
                  directory={formGenerador.responsablesTecnicos}
                  data="responsablesTecnicos"
                  estilos="flex items-center pl-2"
                />
              </div>
            )}
          </div>
        )}

        {/* FLUJO EXCLUSIVO: TRANSPORTISTA (6 Pasos) */}
        {tipoUsuario === "TRANSPORTISTA" && (
          <div className="flex-1 flex flex-col min-h-0">
            {step === 1 && (
              <div className="animate-fade-in overflow-y-auto h-full pr-1 custom-scrollbar">
                <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Datos Operativos de la Empresa</h3>
                <DatosBasicosTransportista formData={formTransportista} setFormData={setFormTransportista} />
              </div>
            )}
            {step === 2 && (
              <div className="animate-fade-in overflow-y-auto h-full pr-1 custom-scrollbar">
                <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Representación Legal y Técnica</h3>
                <RepresentanteYResponsable formData={formTransportista} setFormData={setFormTransportista} />
              </div>
            )}
            {step === 3 && (
              <div className="animate-fade-in overflow-y-auto h-full pr-1 custom-scrollbar">
                <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Planes de Control de Contingencias</h3>
                <Contingencias formData={formTransportista} setFormData={setFormTransportista} />
              </div>
            )}
            {step === 4 && (
              <div className="animate-fade-in overflow-y-auto h-full pr-1 custom-scrollbar">
                <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Listado de Responsables</h3>
                <Directorio
                  estilos="flex justify-center items-center"
                  data="responsables"
                  setForm={setFormTransportista}
                  directory={formTransportista.responsables}
                  ItemComponent={ResponsablesTransportista}
                />
              </div>
            )}
            {step === 5 && (
              <div className="animate-fade-in overflow-y-auto h-full pr-1 custom-scrollbar">
                <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Generadores Vinculados
                  <span className="text-blue-400 text-lg"> (omitir si aún no se ha registrado)</span>
                </h3>
                <Directorio
                  estilos="flex justify-center items-center"
                  data="generadores"
                  setForm={setFormTransportista}
                  directory={formTransportista.generadores}
                  ItemComponent={GeneradoresTransportistas}
                />
              </div>
            )}
            {step === 6 && (
              <div className="animate-fade-in overflow-y-auto h-full pr-1 custom-scrollbar">
                <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Conductores de Unidades</h3>
                <Directorio
                  estilos="flex justify-center items-center"
                  data="conductores"
                  setForm={setFormTransportista}
                  directory={formTransportista.conductores}
                  ItemComponent={Conductores}
                />
              </div>
            )}
          </div>
        )}

        {/* BOTONERA DE CONTROL Y NAVEGACIÓN */}
        {step > 0 && (
          <div className="flex justify-between items-center mt-auto border-t border-gray-200 pt-4">
            <ButtonOk
              children="Atrás"
              onClick={handleAtras}
              classe="!w-32 bg-gray-500 hover:bg-gray-600"
            />

            {step < totalPasos ? (
              <ButtonOk
                children="Siguiente"
                onClick={handleSiguiente}
                classe="!w-32 bg-gradient-to-r from-green-800 to-green-800 hover:from-green-700 hover:to-green-700"
              />
            ) : (
              <ButtonOk
                type="ok"
                children="Finalizar Registro"
                onClick={ejecutarRegistroFinal}
                classe="!w-48 bg-emerald-600 hover:bg-emerald-700"
              />
            )}
          </div>
        )}

      </div>
      <div className="text-center mt-4">
        <Link
          to="/login"
          className="text-sm text-gray-600 hover:text-black transition-colors underline-offset-4 hover:underline"
        >
          ¿Ya tienes una cuenta? Iniciar Sesión
        </Link>
      </div>
    </div>
  );
};

export default Register;
