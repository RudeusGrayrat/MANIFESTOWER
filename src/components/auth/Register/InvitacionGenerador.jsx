import { useEffect, useState } from "react";
import axios from "../../api/axios";
import Input from "../../ui/inputs/Input";

const InvitacionGenerador = () => {
    const [token] = useState(() => window.location.hash.slice(1));
    const [solicitud, setSolicitud] = useState(null);
    const [form, setForm] = useState({ correoElectronico: "", telefono: "", representanteLegal: "", dniRepresentante: "", password: "", confirmarPassword: "", aceptaVinculacion: false });
    const [responsable, setResponsable] = useState({ nombreResponsable: "", dniResponsable: "", cargoResponsable: "", firmaResponsable: "" });
    const [planta, setPlanta] = useState({ denominacion: "", tipoPlanta: "", direccion: "", actividadEconomica: "", ubigeoId: "" });
    const [ubigeoOptions, setUbigeoOptions] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [enviando, setEnviando] = useState(false);
    const [completado, setCompletado] = useState(false);
    const [codigoVerificacion, setCodigoVerificacion] = useState("");
    const [avisoNotificacion, setAvisoNotificacion] = useState(false);

    useEffect(() => {
        window.history.replaceState(null, "", window.location.pathname);
        if (!token) { setError("Falta el código de invitación. Solicita un nuevo enlace a Tower."); setLoading(false); return; }
        axios.post("/manifesTower/invitacion-generador/consultar", { token }).then(({ data }) => {
            setSolicitud(data);
            setForm((prev) => ({ ...prev, correoElectronico: data.correoElectronico, telefono: data.telefono }));
        }).catch((error) => setError(error.response?.data?.message || "No se pudo consultar la invitación."))
            .finally(() => setLoading(false));
    }, [token]);

    const cargarFirma = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (!["image/png", "image/jpeg"].includes(file.type) || file.size > 1024 * 1024) {
            setError("La firma debe ser PNG o JPEG y pesar como máximo 1 MB."); event.target.value = ""; return;
        }
        const reader = new FileReader();
        reader.onload = () => setResponsable((prev) => ({ ...prev, firmaResponsable: reader.result }));
        reader.onerror = () => setError("No se pudo leer la imagen de firma.");
        reader.readAsDataURL(file);
    };
    const submit = async (event) => {
        event.preventDefault(); setError("");
        if (form.password !== form.confirmarPassword) return setError("Las contraseñas no coinciden.");
        if (!responsable.firmaResponsable) return setError("Debes adjuntar la imagen de firma del responsable.");
        if (!planta.ubigeoId?._id && !(typeof planta.ubigeoId === "string" && planta.ubigeoId)) return setError("Selecciona un ubigeo para la planta.");
        setEnviando(true);
        try {
            const { data } = await axios.post("/manifesTower/invitacion-generador/completar", { token, ...form, responsable, planta: { ...planta, ubigeoId: planta.ubigeoId?._id || planta.ubigeoId } });
            setCodigoVerificacion(data.codigoVerificacion);
            setAvisoNotificacion(!!data.notificacionPendiente);
            setForm((prev) => ({ ...prev, password: "", confirmarPassword: "" }));
            setCompletado(true);
        } catch (error) { setError(error.response?.data?.message || "No se pudo completar la solicitud."); }
        finally { setEnviando(false); }
    };
    const campo = (label, name, value, setter, type = "text", extra = {}) => <label className="text-sm font-medium">{label}
        <input required type={type} value={value[name]} onChange={(e) => setter((prev) => ({ ...prev, [name]: e.target.value }))} className="block w-full rounded-lg border border-slate-300 p-2 mt-1" {...extra} />
    </label>;
    if (loading) return <p className="p-6">Comprobando invitación…</p>;
    if (completado) return <div className="p-6 space-y-3"><h2 className="text-xl font-bold text-green-700">Datos enviados</h2><p>Tower verificará independientemente tu empresa antes de activar la cuenta y la vinculación. Aún no puedes iniciar sesión.</p>
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4"><p className="font-semibold">Tu código de comprobación:</p><p className="font-mono text-xl tracking-wider select-all">{codigoVerificacion}</p><p className="text-sm mt-2">Guárdalo ahora. Comunícalo únicamente al personal de Tower por un canal que hayas verificado, cuando te contacten para confirmar tu identidad. Si lo pierdes, puedes generar otro con tu RUC y la contraseña que acabas de crear.</p></div>
        <a href="/recuperar-codigo-generador" className="block text-blue-700 underline">Recuperar código de verificación</a>
        {avisoNotificacion && <p className="text-amber-700">Los datos se guardaron, pero no se pudo notificar a Tower. Contacta a su equipo por un canal verificado.</p>}
        <a href="/login" className="text-blue-700 underline">Volver al inicio</a></div>;
    if (!solicitud) return <div className="p-6 text-red-700" role="alert">{error}</div>;
    return <div className="overflow-y-auto p-4 sm:p-6 h-full">
        <h2 className="text-xl font-bold">Completa el registro de {solicitud.razonSocial}</h2>
        <p className="text-sm text-slate-600 mt-2">RUC: {solicitud.ruc}. La solicitud fue iniciada por {solicitud.transportista?.razonSocial} (RUC {solicitud.transportista?.ruc}). Tower verificará la identidad de tu empresa antes de activar la cuenta.</p>
        <form onSubmit={submit} className="space-y-5 mt-4">
            <section className="grid gap-3 sm:grid-cols-2"><h3 className="sm:col-span-2 font-bold">Datos de contacto y representación</h3>
                {campo("Correo", "correoElectronico", form, setForm, "email")}{campo("Teléfono", "telefono", form, setForm, "tel")}
                {campo("Representante legal", "representanteLegal", form, setForm)}{campo("DNI/CE del representante", "dniRepresentante", form, setForm)}
            </section>
            <section className="grid gap-3 sm:grid-cols-2"><h3 className="sm:col-span-2 font-bold">Planta principal</h3>
                {campo("Denominación", "denominacion", planta, setPlanta)}{campo("Tipo de planta", "tipoPlanta", planta, setPlanta)}
                {campo("Dirección", "direccion", planta, setPlanta)}{campo("Actividad económica", "actividadEconomica", planta, setPlanta)}
                <Input label="Ubigeo de la planta" type="autocomplete" name="ubigeoId" value={planta.ubigeoId} setForm={setPlanta} fetchData="/certificaciones/getUbigeoPaginacion" setOptions={setUbigeoOptions} options={ubigeoOptions} field={(o) => `${o.distrito} - ${o.provincia} - ${o.departamento}`} />
            </section>
            <section className="grid gap-3 sm:grid-cols-2"><h3 className="sm:col-span-2 font-bold">Responsable técnico</h3>
                {campo("Nombre", "nombreResponsable", responsable, setResponsable)}{campo("DNI/CE", "dniResponsable", responsable, setResponsable)}{campo("Cargo", "cargoResponsable", responsable, setResponsable)}
                <label className="text-sm font-medium">Imagen de firma (PNG/JPEG, máximo 1 MB)<input required type="file" accept="image/png,image/jpeg" onChange={cargarFirma} className="block w-full mt-1" /></label>
                <p className="sm:col-span-2 text-xs text-slate-500">Esta imagen se usará en los documentos cuando corresponda. No es una firma digital criptográfica.</p>
            </section>
            <section className="grid gap-3 sm:grid-cols-2"><h3 className="sm:col-span-2 font-bold">Cuenta propia</h3>
                {campo("Contraseña", "password", form, setForm, "password", { minLength: 12, maxLength: 72, autoComplete: "new-password" })}
                {campo("Repetir contraseña", "confirmarPassword", form, setForm, "password", { minLength: 12, maxLength: 72, autoComplete: "new-password" })}
            </section>
            <label className="flex gap-2 text-sm"><input required type="checkbox" checked={form.aceptaVinculacion} onChange={(e) => setForm((prev) => ({ ...prev, aceptaVinculacion: e.target.checked }))} /><span>Acepto vincular mi empresa con {solicitud.transportista?.razonSocial} cuando Tower verifique esta solicitud. Esto no autoriza el uso automático de mi firma ni el envío de manifiestos sin mi revisión.</span></label>
            {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
            <button disabled={enviando} className="w-full rounded-lg bg-blue-700 p-3 text-white disabled:opacity-50">{enviando ? "Enviando…" : "Enviar a verificación"}</button>
        </form>
    </div>;
};
export default InvitacionGenerador;
