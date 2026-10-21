import { useEffect, useState } from "react";
import axios from "../../../api/axios";

const initial = {
    razonSocial: "", ruc: "", correoElectronico: "", telefono: "", representanteLegal: "", dniRepresentante: "", password: "", confirmarPassword: "",
    responsable: { nombreResponsable: "", dniResponsable: "", cargoResponsable: "", correoResponsable: "", telefonoResponsable: "", firmaResponsable: "" },
    planta: { denominacion: "", tipoPlanta: "", direccion: "", actividadEconomica: "", ubigeoId: "", coordenadasUtm: { norte: "", este: "", zona: "" } },
};

const RegistroDirectoGenerador = ({ onBack }) => {
    const [form, setForm] = useState(initial);
    const [ubigeos, setUbigeos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [resultado, setResultado] = useState(null);
    useEffect(() => { axios.get("/certificaciones/getUbigeoPaginacion", { params: { limit: 1000, page: 0 } }).then(({ data }) => setUbigeos(data.data || [])).catch(() => setError("No se pudieron cargar los ubigeos.")); }, []);
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
    const submit = async (event) => {
        event.preventDefault(); setError("");
        if (form.password !== form.confirmarPassword) return setError("Las contraseñas no coinciden.");
        if (!form.responsable.firmaResponsable) return setError("Adjunta la firma del responsable.");
        setLoading(true);
        try {
            const { confirmarPassword, ...payload } = form;
            const { data } = await axios.post("/manifesTower/generadores/registro-directo", payload);
            setResultado(data);
        } catch (response) { setError(response.response?.data?.message || "No se pudo registrar el generador."); }
        finally { setLoading(false); }
    };
    if (resultado) return <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md space-y-3"><h2 className="text-xl font-bold text-green-700">Generador registrado</h2><p>{resultado.message}</p><p className="text-sm text-slate-600">Tower lo verá en Gestower con estado <strong>PENDIENTE</strong>. Al activarlo, quedará habilitada su cuenta y el vínculo con tu empresa.</p><button type="button" onClick={onBack} className="text-blue-700 underline">Volver a generadores</button></div>;
    return <form onSubmit={submit} className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-md space-y-7"><button type="button" onClick={onBack} className="text-blue-700 text-sm underline">Volver a buscar generadores</button><div><h2 className="text-xl font-bold">Registrar generador</h2><p className="text-sm text-slate-600">Registra toda la ficha por cuenta del generador. El portal externo es opcional; Tower verificará el alta antes de habilitarla.</p></div><section className="grid gap-4 sm:grid-cols-2"><h3 className="sm:col-span-2 font-bold">Empresa y representante</h3>{[["razonSocial","Razón social","text"],["ruc","RUC","text"],["correoElectronico","Correo electrónico","email"],["telefono","Teléfono","tel"],["representanteLegal","Representante legal","text"],["dniRepresentante","DNI representante","text"],["password","Contraseña inicial","password"],["confirmarPassword","Confirmar contraseña","password"]].map(([name,label,type]) => <label key={name} className="text-sm font-medium">{label}<input required {...field(name)} type={type} minLength={name.includes("password") ? 12 : undefined} maxLength={name === "ruc" ? 11 : undefined} pattern={name === "ruc" ? "[0-9]{11}" : undefined} className="block mt-1 w-full rounded-lg border border-slate-300 p-2" /></label>)}</section><section className="grid gap-4 sm:grid-cols-2"><h3 className="sm:col-span-2 font-bold">Planta</h3>{[["denominacion","Denominación"],["tipoPlanta","Tipo de planta"],["direccion","Dirección"],["actividadEconomica","Actividad económica"]].map(([name,label]) => <label key={name} className="text-sm font-medium">{label}<input required {...nested("planta",name)} className="block mt-1 w-full rounded-lg border border-slate-300 p-2" /></label>)}<label className="text-sm font-medium">Ubigeo<select required {...nested("planta","ubigeoId")} className="block mt-1 w-full rounded-lg border border-slate-300 p-2"><option value="">Selecciona</option>{ubigeos.map((item) => <option key={item._id} value={item._id}>{item.codigo} · {item.departamento} / {item.provincia} / {item.distrito}</option>)}</select></label>{[["norte","Norte UTM"],["este","Este UTM"],["zona","Zona UTM"]].map(([name,label]) => <label key={name} className="text-sm font-medium">{label}<input value={form.planta.coordenadasUtm[name]} onChange={(event) => setForm((prev) => ({ ...prev, planta: { ...prev.planta, coordenadasUtm: { ...prev.planta.coordenadasUtm, [name]: event.target.value } } }))} className="block mt-1 w-full rounded-lg border border-slate-300 p-2" /></label>)}</section><section className="grid gap-4 sm:grid-cols-2"><h3 className="sm:col-span-2 font-bold">Responsable y firma</h3>{[["nombreResponsable","Nombre completo"],["dniResponsable","DNI"],["cargoResponsable","Cargo"],["correoResponsable","Correo","email"],["telefonoResponsable","Teléfono","tel"]].map(([name,label,type="text"]) => <label key={name} className="text-sm font-medium">{label}<input required {...nested("responsable",name)} type={type} className="block mt-1 w-full rounded-lg border border-slate-300 p-2" /></label>)}<label className="text-sm font-medium">Firma PNG/JPG<input required type="file" accept="image/png,image/jpeg" onChange={firmar} className="block mt-1 w-full text-sm" />{form.responsable.firmaResponsable && <span className="text-green-700 text-xs">Firma cargada</span>}</label></section>{error && <p role="alert" className="text-red-700 text-sm">{error}</p>}<button disabled={loading} className="rounded-lg bg-blue-700 px-5 py-3 text-white disabled:opacity-50">{loading ? "Registrando…" : "Registrar generador y enviar a Tower"}</button></form>;
};

export default RegistroDirectoGenerador;
