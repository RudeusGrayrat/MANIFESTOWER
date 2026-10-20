import { useEffect, useState } from "react";
import axios from "../../../api/axios";

const SolicitudGenerador = ({ onBack }) => {
    const [form, setForm] = useState({ razonSocial: "", ruc: "", correoElectronico: "", telefono: "" });
    const [enlace, setEnlace] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [copiado, setCopiado] = useState(false);
    const [advertencia, setAdvertencia] = useState("");
    const [solicitudes, setSolicitudes] = useState([]);
    const headers = () => ({ Authorization: `Bearer ${localStorage.getItem("token") || ""}` });
    const cargarSolicitudes = async () => {
        try { const { data } = await axios.get("/manifesTower/mis-solicitudes-generador", { headers: headers() }); setSolicitudes(data.data || []); }
        catch (error) { setError(error.response?.data?.message || "No se pudieron consultar las solicitudes."); }
    };
    useEffect(() => { cargarSolicitudes(); }, []);

    const submit = async (event) => {
        event.preventDefault(); setError(""); setAdvertencia(""); setCopiado(false); setLoading(true);
        try {
            const { data } = await axios.post("/manifesTower/solicitudes-generador", form, { headers: headers() });
            if (data.modo === "VINCULACION") {
                setEnlace("");
                setForm({ razonSocial: "", ruc: "", correoElectronico: "", telefono: "" });
                setAdvertencia(data.notificacionPendiente
                    ? "El generador ya existía. La solicitud de vínculo se registró, pero no se pudo notificar a su cuenta."
                    : "El generador ya existía. Se envió la solicitud de vínculo a su cuenta.");
            } else {
                setEnlace(`${window.location.origin}/invitacion-generador#${data.token}`);
                if (data.notificacionPendiente) setAdvertencia("La solicitud se guardó, pero Tower no recibió la notificación; comunícate con su equipo.");
            }
            await cargarSolicitudes();
        } catch (error) { setError(error.response?.data?.message || "No se pudo crear la solicitud."); }
        finally { setLoading(false); }
    };
    const renovar = async (id) => {
        if (!window.confirm("Se invalidará cualquier enlace anterior. ¿Generar uno nuevo?")) return;
        setLoading(true); setError(""); setCopiado(false);
        try {
            const { data } = await axios.post(`/manifesTower/mis-solicitudes-generador/${id}/renovar`, {}, { headers: headers() });
            setEnlace(`${window.location.origin}/invitacion-generador#${data.token}`);
            await cargarSolicitudes();
        } catch (error) { setError(error.response?.data?.message || "No se pudo renovar el enlace."); }
        finally { setLoading(false); }
    };
    const copiar = async () => {
        try { await navigator.clipboard.writeText(enlace); setCopiado(true); }
        catch (_) { setError("No se pudo copiar automáticamente. Selecciona y copia el enlace mostrado."); }
    };
    const campos = [["razonSocial", "Razón social", "text"], ["ruc", "RUC", "text"], ["correoElectronico", "Correo electrónico", "email"], ["telefono", "Teléfono", "tel"]];
    return <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md space-y-4">
        <button type="button" onClick={onBack} className="text-blue-700 text-sm underline">Volver a buscar generadores</button>
        <h2 className="text-xl font-bold">Solicitar registro de un generador</h2>
        <p className="text-sm text-slate-600">La ficha será provisional. El generador completará sus datos y Tower verificará su identidad antes de activar la cuenta y la vinculación.</p>
        {!enlace ? <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
            {campos.map(([name, label, type]) => <label key={name} className="text-sm font-medium">{label}
                <input required type={type} maxLength={name === "ruc" ? 11 : 200} pattern={name === "ruc" ? "[0-9]{11}" : undefined} value={form[name]} onChange={(e) => setForm((prev) => ({ ...prev, [name]: e.target.value }))} className="block w-full border border-slate-300 rounded-lg p-2 mt-1" />
            </label>)}
            <button disabled={loading} className="sm:col-span-2 bg-blue-700 text-white rounded-lg p-3 disabled:opacity-50">{loading ? "Creando…" : "Crear solicitud y generar enlace"}</button>
        </form> : <div className="space-y-3">
            <p className="text-sm text-green-700">Solicitud creada. Comparte este enlace únicamente con la persona de contacto del generador. Vence en 72 horas y se puede usar una sola vez.</p>
            <textarea readOnly value={enlace} rows={3} className="w-full rounded-lg border border-slate-300 p-2 text-sm" />
            <button type="button" onClick={copiar} className="bg-blue-700 text-white rounded-lg px-4 py-2">{copiado ? "Copiado" : "Copiar enlace"}</button>
            <p className="text-xs text-slate-500">El enlace solo se muestra ahora. Si se pierde o vence, puedes generar otro desde tus solicitudes.</p>
        </div>}
        {solicitudes.length > 0 && <section className="border-t pt-4 space-y-2"><h3 className="font-bold">Tus solicitudes pendientes</h3>
            {solicitudes.map((solicitud) => <div key={solicitud._id} className="rounded-lg border p-3 text-sm flex flex-wrap items-center justify-between gap-2">
                <div><strong>{solicitud.razonSocial}</strong> · {solicitud.ruc}<p>{solicitud.estado === "PENDIENTE_DATOS" ? "Esperando que el generador complete sus datos" : "Pendiente de verificación de Tower"}</p></div>
                {solicitud.estado === "PENDIENTE_DATOS" && <button type="button" disabled={loading} onClick={() => renovar(solicitud._id)} className="text-blue-700 underline disabled:opacity-50">Generar nuevo enlace</button>}
            </div>)}
        </section>}
        {advertencia && <p role="alert" className="text-amber-700 text-sm">{advertencia}</p>}
        {error && <p role="alert" className="text-red-700 text-sm">{error}</p>}
    </div>;
};

export default SolicitudGenerador;
