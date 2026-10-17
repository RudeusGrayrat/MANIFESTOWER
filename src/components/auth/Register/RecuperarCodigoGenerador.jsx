import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "../../api/axios";

const RecuperarCodigoGenerador = () => {
    const [ruc, setRuc] = useState("");
    const [password, setPassword] = useState("");
    const [codigo, setCodigo] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const submit = async (event) => {
        event.preventDefault();
        setError(""); setLoading(true);
        try {
            const { data } = await axios.post("/manifesTower/invitacion-generador/recuperar-codigo", { ruc, password });
            setCodigo(data.codigoVerificacion);
            setPassword("");
        } catch (err) { setError(err.response?.data?.message || "No se pudo recuperar el código. Intenta más tarde."); }
        finally { setLoading(false); }
    };

    return <div className="w-full max-w-md mx-auto p-5 space-y-4">
        <h2 className="text-xl font-bold">Recuperar código de verificación</h2>
        {codigo ? <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 space-y-2" role="status">
            <p>Tu nuevo código es:</p><p className="font-mono text-xl tracking-wider select-all">{codigo}</p>
            <p className="text-sm">El código anterior ya no sirve. Comunica este código únicamente a Tower por un canal verificado. Tu cuenta sigue pendiente de verificación.</p>
        </div> : <>
            <p className="text-sm text-slate-600">Si ya enviaste tus datos para revisión, ingresa tu RUC y la contraseña que elegiste. Generaremos un código nuevo.</p>
            <form onSubmit={submit} className="space-y-4">
                <label className="block text-sm font-medium">RUC<input required inputMode="numeric" pattern="[0-9]{11}" maxLength={11} value={ruc} onChange={(event) => setRuc(event.target.value)} className="block w-full rounded-lg border border-slate-300 p-2 mt-1" /></label>
                <label className="block text-sm font-medium">Contraseña creada para la solicitud<input required type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="block w-full rounded-lg border border-slate-300 p-2 mt-1" /></label>
                {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
                <button disabled={loading} className="w-full rounded-lg bg-blue-700 p-3 text-white disabled:opacity-50">{loading ? "Verificando…" : "Generar código nuevo"}</button>
            </form>
            <p className="text-xs text-slate-500">Los intentos son limitados. Si también olvidaste la contraseña, contacta a Tower por un canal verificado.</p>
        </>}
        <Link to="/login" className="block text-blue-700 underline">Volver al inicio</Link>
    </div>;
};
export default RecuperarCodigoGenerador;
