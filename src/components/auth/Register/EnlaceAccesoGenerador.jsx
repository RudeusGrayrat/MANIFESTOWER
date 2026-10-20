import { useEffect, useState } from "react";
import axios from "../../api/axios";

const EnlaceAccesoGenerador = () => {
    const [token] = useState(() => window.location.hash.slice(1));
    const [empresa, setEmpresa] = useState(null);
    const [password, setPassword] = useState("");
    const [confirmacion, setConfirmacion] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [enviando, setEnviando] = useState(false);
    const [completado, setCompletado] = useState(false);

    useEffect(() => {
        window.history.replaceState(null, "", window.location.pathname);
        if (!token) { setError("Falta el código de acceso. Solicita un enlace nuevo al transportista."); setLoading(false); return; }
        axios.post("/manifesTower/enlace-acceso-generador/consultar", { token })
            .then(({ data }) => setEmpresa(data))
            .catch((response) => setError(response.response?.data?.message || "No se pudo validar el enlace."))
            .finally(() => setLoading(false));
    }, [token]);

    const submit = async (event) => {
        event.preventDefault(); setError("");
        if (password !== confirmacion) return setError("Las contraseñas no coinciden.");
        setEnviando(true);
        try {
            await axios.post("/manifesTower/enlace-acceso-generador/completar", { token, password });
            setPassword(""); setConfirmacion(""); setCompletado(true);
        } catch (response) { setError(response.response?.data?.message || "No se pudo actualizar la contraseña."); }
        finally { setEnviando(false); }
    };

    if (loading) return <p className="p-6">Comprobando enlace…</p>;
    if (completado) return <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-xl shadow-md space-y-3"><h1 className="text-xl font-bold text-green-700">Acceso actualizado</h1><p>La contraseña de {empresa?.razonSocial} se actualizó correctamente. Ya puedes iniciar sesión.</p><a className="text-blue-700 underline" href="/">Ir al inicio de sesión</a></div>;
    if (error && !empresa) return <p role="alert" className="p-6 text-red-700">{error}</p>;
    return <form onSubmit={submit} className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-xl shadow-md space-y-4"><h1 className="text-xl font-bold">Crear nueva contraseña</h1><p className="text-sm text-slate-600">Cuenta: <strong>{empresa?.razonSocial}</strong> · RUC {empresa?.ruc}</p><label className="block text-sm font-medium">Nueva contraseña<input required minLength={12} maxLength={72} type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="block w-full rounded-lg border border-slate-300 p-2 mt-1" /></label><label className="block text-sm font-medium">Confirmar contraseña<input required minLength={12} maxLength={72} type="password" value={confirmacion} onChange={(event) => setConfirmacion(event.target.value)} className="block w-full rounded-lg border border-slate-300 p-2 mt-1" /></label>{error && <p role="alert" className="text-sm text-red-700">{error}</p>}<button disabled={enviando} className="w-full rounded-lg bg-blue-700 p-3 text-white disabled:opacity-50">{enviando ? "Actualizando…" : "Actualizar contraseña"}</button></form>;
};

export default EnlaceAccesoGenerador;
