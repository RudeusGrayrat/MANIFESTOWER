import { useEffect, useState } from "react";
import axios from "../../../api/axios";
import { AutoComplete } from "primereact/autocomplete";
import FichaGenerador from "./FichaGenerador";

const initial = {
    razonSocial: "", ruc: "", correoElectronico: "", telefono: "", representanteLegal: "", dniRepresentante: "",
    responsable: { nombreResponsable: "", dniResponsable: "", cargoResponsable: "", correoResponsable: "", telefonoResponsable: "", firmaResponsable: "" },
    planta: { denominacion: "", tipoPlanta: "", direccion: "", actividadEconomica: "", ubigeoId: "", coordenadasUtm: { norte: "", este: "", zona: "" } },
};

const RegistroDirectoGenerador = ({ onBack, generador, onSaved }) => {
    return <FichaGenerador initial={generador} onBack={onBack} onSaved={onSaved} />;
    const [form, setForm] = useState(initial);
    const [ubigeos, setUbigeos] = useState([]);
    const [ubigeoSeleccionado, setUbigeoSeleccionado] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [resultado, setResultado] = useState(null);
    const field = (name, value = form[name]) => ({ value, onChange: (event) => setForm((prev) => ({ ...prev, [name]: event.target.value })) });
    const nested = (section, name) => ({ value: form[section][name], onChange: (event) => setForm((prev) => ({ ...prev, [section]: { ...prev[section], [name]: event.target.value } })) });
    const firmar = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (!['image/png', 'image/jpeg'].includes(file.type) || file.size > 1024 * 1024) { setError("La firma debe ser PNG o JPG y pesar como máximo 1 MB."); event.target.value = ""; return; }
        const reader = new FileReader();
        reader.onload = () => setForm((prev) => ({ ...prev, responsable: { ...prev.responsable, firmaResponsable: reader.result } }));
        reader.onerror = () => setError("No se pudo leer la firma."); reader.readAsDataURL(file);
    };
    const etiquetaUbigeo = (ubigeo) => `${ubigeo.codigo} · ${ubigeo.distrito}, ${ubigeo.provincia}, ${ubigeo.departamento}`;
    const buscarUbigeo = async ({ query }) => {
        try {
            const { data } = await axios.get("/certificaciones/getUbigeoPaginacion", { params: { page: 0, limit: 20, search: query, estado: "ACTIVO" } });
            setUbigeos((data.data || []).map((ubigeo) => ({ ...ubigeo, label: etiquetaUbigeo(ubigeo) })));
        } catch (_) { setUbigeos([]); }
    };
    const seleccionarUbigeo = (event) => {
        const seleccionado = event.value;
        // El formulario guarda exclusivamente el ObjectId. El objeto solo se
        // conserva para mostrar el texto seleccionado en el autocomplete.
        if (seleccionado && typeof seleccionado === "object" && seleccionado._id) {
            setUbigeoSeleccionado(seleccionado);
            setForm((prev) => ({ ...prev, planta: { ...prev.planta, ubigeoId: seleccionado._id } }));
            return;
        }
        setUbigeoSeleccionado(seleccionado || null);
        if (!seleccionado) setForm((prev) => ({ ...prev, planta: { ...prev.planta, ubigeoId: "" } }));
    };
    const submit = async (event) => {
        event.preventDefault(); setError("");
        if (!form.responsable.firmaResponsable) return setError("Adjunta la firma del responsable.");
        setLoading(true);
        try {
            const { data } = await axios.post("/manifesTower/generadores/registro-directo", form);
            setResultado(data);
        } catch (response) { setError(response.response?.data?.message || "No se pudo registrar el generador."); }
        finally { setLoading(false); }
    };
    if (resultado) return <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md space-y-3"><h2 className="text-xl font-bold text-green-700">Generador registrado</h2><p>{resultado.message}</p><p className="text-sm text-slate-600">Tower lo verá en Gestower con estado <strong>PENDIENTE</strong>. Al activarlo, quedarán habilitados el vínculo y su cuenta. Podrá ingresar con su RUC como contraseña inicial y cambiarla desde su perfil.</p><button type="button" onClick={onBack} className="text-blue-700 underline">Volver a generadores</button></div>;
    return <form onSubmit={submit} className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-md space-y-7"><button type="button" onClick={onBack} className="text-blue-700 text-sm underline">Volver a buscar generadores</button><div><h2 className="text-xl font-bold">Registrar generador</h2><p className="text-sm text-slate-600">Registra toda la ficha por cuenta del generador. Tower verificará el alta antes de habilitarla.</p><p className="mt-2 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">Al ser activado, el generador ingresará a ManifesTower con su RUC como contraseña inicial. Podrá cambiarla luego desde su perfil.</p></div><section className="grid gap-4 sm:grid-cols-2"><h3 className="sm:col-span-2 font-bold">Empresa y representante</h3>{[["razonSocial","Razón social","text"],["ruc","RUC","text"],["correoElectronico","Correo electrónico","email"],["telefono","Teléfono","tel"],["representanteLegal","Representante legal","text"],["dniRepresentante","DNI representante","text"]].map(([name,label,type]) => <label key={name} className="text-sm font-medium">{label}<input required {...field(name)} type={type} maxLength={name === "ruc" ? 11 : undefined} pattern={name === "ruc" ? "[0-9]{11}" : undefined} className="block mt-1 w-full rounded-lg border border-slate-300 p-2" /></label>)}</section><section className="grid gap-4 sm:grid-cols-2"><h3 className="sm:col-span-2 font-bold">Planta</h3>{[["denominacion","Denominación"],["tipoPlanta","Tipo de planta"],["direccion","Dirección"],["actividadEconomica","Actividad económica"]].map(([name,label]) => <label key={name} className="text-sm font-medium">{label}<input required {...nested("planta",name)} className="block mt-1 w-full rounded-lg border border-slate-300 p-2" /></label>)}<label className="text-sm font-medium">Ubigeo<AutoComplete value={ubigeoSeleccionado} suggestions={ubigeos} completeMethod={buscarUbigeo} onChange={seleccionarUbigeo} field="label" itemTemplate={(item) => item.label} dropdown forceSelection placeholder="Busca por código, distrito, provincia o departamento" className="block mt-1 w-full" inputClassName="w-full rounded-lg border border-slate-300 p-2" /></label>{[["norte","Norte UTM"],["este","Este UTM"],["zona","Zona UTM"]].map(([name,label]) => <label key={name} className="text-sm font-medium">{label}<input value={form.planta.coordenadasUtm[name]} onChange={(event) => setForm((prev) => ({ ...prev, planta: { ...prev.planta, coordenadasUtm: { ...prev.planta.coordenadasUtm, [name]: event.target.value } } }))} className="block mt-1 w-full rounded-lg border border-slate-300 p-2" /></label>)}</section><section className="grid gap-4 sm:grid-cols-2"><h3 className="sm:col-span-2 font-bold">Responsable y firma</h3>{[["nombreResponsable","Nombre completo"],["dniResponsable","DNI"],["cargoResponsable","Cargo"],["correoResponsable","Correo","email"],["telefonoResponsable","Teléfono","tel"]].map(([name,label,type="text"]) => <label key={name} className="text-sm font-medium">{label}<input required {...nested("responsable",name)} type={type} className="block mt-1 w-full rounded-lg border border-slate-300 p-2" /></label>)}<label className="text-sm font-medium">Firma PNG/JPG<input required type="file" accept="image/png,image/jpeg" onChange={firmar} className="block mt-1 w-full text-sm" />{form.responsable.firmaResponsable && <span className="text-green-700 text-xs">Firma cargada</span>}</label></section>{error && <p role="alert" className="text-red-700 text-sm">{error}</p>}<button disabled={loading} className="rounded-lg bg-blue-700 px-5 py-3 text-white disabled:opacity-50">{loading ? "Registrando…" : "Registrar generador y enviar a Tower"}</button></form>;
};

export default RegistroDirectoGenerador;
