import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../notificaciones/ToastContext";
import axios from "../../api/axios";
import Input from "../../ui/inputs/Input";
import InputNormal from "../../ui/inputs/Normal";
import ButtonOk from "../../ui/Buttons/Buttons";

const Perfil = () => {
    const { user, activeRole, setActiveRole } = useAuth(); // Asumimos que tienes setActiveRole
    const { showSuccess, showError, showInfo } = useToast();
    const [loading, setLoading] = useState(false);
    const [perfil, setPerfil] = useState(null);
    const [editando, setEditando] = useState(false);
    const [formData, setFormData] = useState({});

    // Estados para gestionar arrays (responsables, plantas, conductores)
    const [responsables, setResponsables] = useState([]);
    const [plantas, setPlantas] = useState([]);
    const [conductores, setConductores] = useState([]);
    const [nuevoResponsable, setNuevoResponsable] = useState({});
    const [nuevaPlanta, setNuevaPlanta] = useState({});
    const [nuevoConductor, setNuevoConductor] = useState({});
    const [showFormResponsable, setShowFormResponsable] = useState(false);
    const [showFormPlanta, setShowFormPlanta] = useState(false);
    const [showFormConductor, setShowFormConductor] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const fileInputRef = useRef(null);

    // Cargar datos del perfil según rol
    useEffect(() => {
        const fetchPerfil = async () => {
            try {
                if (!user) return;
                console.log("Fetching perfil for user:", user, "with role:", activeRole);
                let endpoint = "";
                if (activeRole === "GENERADOR") {
                    endpoint = `/certificaciones/getGeneradorById/${user.generadorId}`;
                } else if (activeRole === "TRANSPORTISTA") {
                    endpoint = `/certificaciones/getTransportistaById/${user.transportistaId}`;
                } else {
                    showError("Rol no reconocido");
                    return;
                }
                const response = await axios.get(endpoint);
                const data = response.data;

                setPerfil(data);
                setFormData(data);
                // Inicializar arrays
                if (activeRole === "GENERADOR") {
                    setResponsables(data.responsablesTecnicos || []);
                    setPlantas(data.plantas || []);
                } else {
                    setResponsables(data.responsables || []);
                    setConductores(data.conductores || []);
                }
            } catch (error) {
                showError("Error al cargar datos del perfil");
                console.error(error);
            }
        };
        if (user) fetchPerfil();
    }, [user, activeRole]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Guardar cambios generales
    const handleSaveGeneral = async () => {
        setLoading(true);
        try {
            const endpoint =
                activeRole === "GENERADOR"
                    ? `/certificaciones/patchGenerador/${perfil._id}`
                    : `/certificaciones/patchTransportista/${perfil._id}`;
            const payload = { ...formData };
            // Si no se modificó la contraseña, no la enviamos
            delete payload.password;
            await axios.patch(endpoint, payload);
            showSuccess("Datos actualizados correctamente");
            setEditando(false);
            // Recargar perfil
            const updated = await axios.get(
                activeRole === "GENERADOR"
                    ? `/certificaciones/getGeneradorById/${perfil._id}`
                    : `/certificaciones/getTransportistaById/${perfil._id}`
            );
            setPerfil(updated.data);
            setFormData(updated.data);
        } catch (error) {
            showError(error.response?.data?.message || "Error al actualizar");
        } finally {
            setLoading(false);
        }
    };

    // ========== MANEJO DE RESPONSABLES ==========
    const handleAddResponsable = async () => {
        if (!nuevoResponsable.nombre) {
            showInfo("Debe ingresar al menos el nombre");
            return;
        }
        setLoading(true);
        try {
            // Subir firma si existe
            let firmaUrl = null;
            if (nuevoResponsable.firmaBase64) {
                const formDataImg = new FormData();
                formDataImg.append("file", nuevoResponsable.firmaBase64);
                const uploadRes = await axios.post("/upload/firma", formDataImg);
                firmaUrl = uploadRes.data.url;
            }
            const nuevo = {
                ...nuevoResponsable,
                firmaResponsable: firmaUrl || "",
            };
            // Actualizar array en el perfil
            const updatedArray = [...responsables, nuevo];
            await updatePerfilArray("responsablesTecnicos", updatedArray);
            setResponsables(updatedArray);
            setNuevoResponsable({});
            setShowFormResponsable(false);
            showSuccess("Responsable agregado");
        } catch (error) {
            showError("Error al agregar responsable");
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveResponsable = async (index) => {
        if (!window.confirm("¿Eliminar este responsable?")) return;
        setLoading(true);
        try {
            const updated = responsables.filter((_, i) => i !== index);
            await updatePerfilArray("responsablesTecnicos", updated);
            setResponsables(updated);
            showSuccess("Responsable eliminado");
        } catch (error) {
            showError("Error al eliminar");
        } finally {
            setLoading(false);
        }
    };

    // Función genérica para actualizar arrays en el backend
    const updatePerfilArray = async (arrayField, newArray) => {
        const endpoint =
            activeRole === "GENERADOR"
                ? `/certificaciones/patchGenerador/${perfil._id}`
                : `/certificaciones/patchTransportista/${perfil._id}`;
        // Si es GENERADOR, el campo es "responsablesTecnicos", si es TRANSPORTISTA es "responsables"
        const field = activeRole === "GENERADOR" ? "responsablesTecnicos" : "responsables";
        await axios.patch(endpoint, { [field]: newArray });
        // Actualizar perfil local
        setPerfil((prev) => ({ ...prev, [field]: newArray }));
    };

    // ========== MANEJO DE PLANTAS (solo GENERADOR) ==========
    const handleAddPlanta = async () => {
        if (!nuevaPlanta.denominacion || !nuevaPlanta.direccion) {
            showInfo("Complete denominación y dirección");
            return;
        }
        setLoading(true);
        try {
            const updated = [...plantas, nuevaPlanta];
            await axios.patch(`/certificaciones/patchGenerador/${perfil._id}`, {
                plantas: updated,
            });
            setPlantas(updated);
            setNuevaPlanta({});
            setShowFormPlanta(false);
            showSuccess("Planta agregada");
        } catch (error) {
            showError("Error al agregar planta");
        } finally {
            setLoading(false);
        }
    };

    const handleRemovePlanta = async (index) => {
        if (!window.confirm("¿Eliminar planta?")) return;
        setLoading(true);
        try {
            const updated = plantas.filter((_, i) => i !== index);
            await axios.patch(`/certificaciones/patchGenerador/${perfil._id}`, {
                plantas: updated,
            });
            setPlantas(updated);
            showSuccess("Planta eliminada");
        } catch (error) {
            showError("Error al eliminar planta");
        } finally {
            setLoading(false);
        }
    };

    // ========== MANEJO DE CONDUCTORES (solo TRANSPORTISTA) ==========
    const handleAddConductor = async () => {
        if (!nuevoConductor.nombre || !nuevoConductor.licencia) {
            showInfo("Complete nombre y licencia");
            return;
        }
        setLoading(true);
        try {
            const updated = [...conductores, nuevoConductor];
            await axios.patch(`/certificaciones/patchTransportista/${perfil._id}`, {
                conductores: updated,
            });
            setConductores(updated);
            setNuevoConductor({});
            setShowFormConductor(false);
            showSuccess("Conductor agregado");
        } catch (error) {
            showError("Error al agregar conductor");
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveConductor = async (index) => {
        if (!window.confirm("¿Eliminar conductor?")) return;
        setLoading(true);
        try {
            const updated = conductores.filter((_, i) => i !== index);
            await axios.patch(`/certificaciones/patchTransportista/${perfil._id}`, {
                conductores: updated,
            });
            setConductores(updated);
            showSuccess("Conductor eliminado");
        } finally {
            setLoading(false);
        }
    };

    // ========== CAMBIO DE CONTRASEÑA ==========
    const handleChangePassword = async () => {
        if (!formData.newPassword || formData.newPassword.length < 6) {
            showInfo("La contraseña debe tener al menos 6 caracteres");
            return;
        }
        setLoading(true);
        try {
            const endpoint = "/manifesTower/patchUserExternal"; // Asume que tienes este endpoint
            const response = await axios.patch(endpoint, {
                userId: user._id,
                newPassword: formData.newPassword,
            });
            if (response.data) {
                showSuccess(response.data.message || "Contraseña cambiada correctamente");
            }
            setFormData((prev) => ({ ...prev, newPassword: "" }));
        } catch (error) {
            showError(error.response?.data?.message || "Error al cambiar contraseña");
        } finally {
            setLoading(false);
        }
    };

    if (!perfil) return <div className="p-10 text-center">Cargando perfil...</div>;

    return (
        <div className="container mx-auto p-4 max-w-7xl">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
                Mi Perfil y Configuración
            </h1>

            {/* Sección: Datos Generales */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 md:p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-700">Datos de la Empresa</h2>
                    <button
                        onClick={() => setEditando(!editando)}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                        {editando ? "Cancelar" : "Editar"}
                    </button>
                </div>

                {!editando ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <p><strong>Razón Social:</strong> {perfil.razonSocial}</p>
                        <p><strong>RUC:</strong> {perfil.ruc}</p>
                        <p><strong>Correo:</strong> {perfil.correoElectronico}</p>
                        <p><strong>Teléfono:</strong> {perfil.telefono}</p>
                        <p><strong>Dirección:</strong> {perfil.direccion || "No registrada"}</p>
                        <p><strong>Estado:</strong> <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${perfil.estado === "ACTIVO" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{perfil.estado}</span></p>
                        {activeRole === "TRANSPORTISTA" && (
                            <>
                                <p><strong>Registro EO-RS:</strong> {perfil.registroEors}</p>
                                <p><strong>Autorización Municipal:</strong> {perfil.autorizacionMunicipal || "N/A"}</p>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Razón Social" name="razonSocial" value={formData.razonSocial} onChange={handleInputChange} />
                        <Input label="RUC" name="ruc" value={formData.ruc} onChange={handleInputChange} />
                        <Input label="Correo" name="correoElectronico" value={formData.correoElectronico} onChange={handleInputChange} />
                        <Input label="Teléfono" name="telefono" value={formData.telefono} onChange={handleInputChange} />
                        <InputNormal label="Dirección" name="direccion" value={formData.direccion} onChange={handleInputChange} ancho="w-full" />
                        {activeRole === "TRANSPORTISTA" && (
                            <>
                                <Input label="Registro EO-RS" name="registroEors" value={formData.registroEors} onChange={handleInputChange} />
                                <Input label="Autorización Municipal" name="autorizacionMunicipal" value={formData.autorizacionMunicipal} onChange={handleInputChange} />
                            </>
                        )}
                        <div className="col-span-1 md:col-span-2 flex justify-end gap-4 mt-4">
                            <ButtonOk children="Guardar" type="ok" onClick={handleSaveGeneral} disabled={loading} />
                            <ButtonOk children="Cancelar" onClick={() => setEditando(false)} />
                        </div>
                    </div>
                )}
            </div>

            {/* Sección: Gestión de Responsables (común a ambos roles) */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 md:p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">
                    {activeRole === "GENERADOR" ? "Responsables Técnicos" : "Responsables"}
                </h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 text-left">Nombre</th>
                                <th className="px-4 py-2 text-left">DNI</th>
                                <th className="px-4 py-2 text-left">Cargo</th>
                                <th className="px-4 py-2 text-left">Firma</th>
                                <th className="px-4 py-2 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {responsables.map((resp, index) => (
                                <tr key={index}>
                                    <td className="px-4 py-2">{resp.nombre || resp.nombreResponsable}</td>
                                    <td className="px-4 py-2">{resp.dni || resp.dniResponsable}</td>
                                    <td className="px-4 py-2">{resp.cargo || resp.cargoResponsable}</td>
                                    <td className="px-4 py-2">
                                        {resp.firmaResponsable ? (
                                            <img src={resp.firmaResponsable} alt="firma" className="h-8 w-auto" />
                                        ) : (
                                            <span className="text-gray-400 text-xs">Sin firma</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-2 text-center">
                                        <button
                                            onClick={() => handleRemoveResponsable(index)}
                                            className="text-red-500 hover:text-red-700 text-sm"
                                        >
                                            <i className="pi pi-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {responsables.length === 0 && (
                                <tr><td colSpan="5" className="text-center py-4 text-gray-400">No hay responsables registrados</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Botón para agregar responsable */}
                <button
                    onClick={() => setShowFormResponsable(!showFormResponsable)}
                    className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                    {showFormResponsable ? "Cancelar" : "+ Agregar responsable"}
                </button>

                {showFormResponsable && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                            label="Nombre"
                            value={nuevoResponsable.nombre || ""}
                            onChange={(e) => setNuevoResponsable({ ...nuevoResponsable, nombre: e.target.value.toUpperCase() })}
                            placeholder="Nombre completo"
                        />
                        <Input
                            label="DNI"
                            value={nuevoResponsable.dni || ""}
                            onChange={(e) => setNuevoResponsable({ ...nuevoResponsable, dni: e.target.value })}
                            placeholder="DNI"
                        />
                        <Input
                            label="Cargo"
                            value={nuevoResponsable.cargo || ""}
                            onChange={(e) => setNuevoResponsable({ ...nuevoResponsable, cargo: e.target.value.toUpperCase() })}
                            placeholder="Cargo"
                        />
                        <div className="col-span-1 md:col-span-3">
                            <label className="block text-sm font-medium text-gray-700">Firma (imagen)</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onload = (ev) => {
                                            setNuevoResponsable({ ...nuevoResponsable, firmaBase64: ev.target.result.split(",")[1] });
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }}
                                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                        </div>
                        <div className="col-span-1 md:col-span-3 flex justify-end gap-4">
                            <ButtonOk children="Guardar" type="ok" onClick={handleAddResponsable} disabled={loading} />
                        </div>
                    </div>
                )}
            </div>

            {/* Sección: Plantas (solo GENERADOR) */}
            {activeRole === "GENERADOR" && (
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 md:p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Plantas</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left">Denominación</th>
                                    <th className="px-4 py-2 text-left">Tipo</th>
                                    <th className="px-4 py-2 text-left">Dirección</th>
                                    <th className="px-4 py-2 text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {plantas.map((planta, index) => (
                                    <tr key={index}>
                                        <td className="px-4 py-2">{planta.denominacion}</td>
                                        <td className="px-4 py-2">{planta.tipoPlanta}</td>
                                        <td className="px-4 py-2">{planta.direccion}</td>
                                        <td className="px-4 py-2 text-center">
                                            <button
                                                onClick={() => handleRemovePlanta(index)}
                                                className="text-red-500 hover:text-red-700 text-sm"
                                            >
                                                <i className="pi pi-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {plantas.length === 0 && (
                                    <tr><td colSpan="4" className="text-center py-4 text-gray-400">No hay plantas registradas</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <button
                        onClick={() => setShowFormPlanta(!showFormPlanta)}
                        className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                        {showFormPlanta ? "Cancelar" : "+ Agregar planta"}
                    </button>
                    {showFormPlanta && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Denominación"
                                value={nuevaPlanta.denominacion || ""}
                                onChange={(e) => setNuevaPlanta({ ...nuevaPlanta, denominacion: e.target.value.toUpperCase() })}
                                placeholder="Nombre de la planta"
                            />
                            <Input
                                label="Tipo de Planta"
                                value={nuevaPlanta.tipoPlanta || ""}
                                onChange={(e) => setNuevaPlanta({ ...nuevaPlanta, tipoPlanta: e.target.value.toUpperCase() })}
                                placeholder="Ej: TRATAMIENTO"
                            />
                            <InputNormal
                                label="Dirección"
                                value={nuevaPlanta.direccion || ""}
                                onChange={(e) => setNuevaPlanta({ ...nuevaPlanta, direccion: e.target.value.toUpperCase() })}
                                ancho="w-full"
                            />
                            <div className="col-span-1 md:col-span-2 flex justify-end gap-4">
                                <ButtonOk children="Guardar" type="ok" onClick={handleAddPlanta} disabled={loading} />
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Sección: Conductores (solo TRANSPORTISTA) */}
            {activeRole === "TRANSPORTISTA" && (
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 md:p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Conductores</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left">Nombre</th>
                                    <th className="px-4 py-2 text-left">Licencia</th>
                                    <th className="px-4 py-2 text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {conductores.map((cond, index) => (
                                    <tr key={index}>
                                        <td className="px-4 py-2">{cond.nombre}</td>
                                        <td className="px-4 py-2">{cond.licencia}</td>
                                        <td className="px-4 py-2 text-center">
                                            <button
                                                onClick={() => handleRemoveConductor(index)}
                                                className="text-red-500 hover:text-red-700 text-sm"
                                            >
                                                <i className="pi pi-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {conductores.length === 0 && (
                                    <tr><td colSpan="3" className="text-center py-4 text-gray-400">No hay conductores registrados</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <button
                        onClick={() => setShowFormConductor(!showFormConductor)}
                        className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                        {showFormConductor ? "Cancelar" : "+ Agregar conductor"}
                    </button>
                    {showFormConductor && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Nombre completo"
                                value={nuevoConductor.nombre || ""}
                                onChange={(e) => setNuevoConductor({ ...nuevoConductor, nombre: e.target.value.toUpperCase() })}
                                placeholder="Nombre del conductor"
                            />
                            <Input
                                label="Licencia"
                                value={nuevoConductor.licencia || ""}
                                onChange={(e) => setNuevoConductor({ ...nuevoConductor, licencia: e.target.value.toUpperCase() })}
                                placeholder="Número de licencia"
                            />
                            <div className="col-span-1 md:col-span-2 flex justify-end gap-4">
                                <ButtonOk children="Guardar" type="ok" onClick={handleAddConductor} disabled={loading} />
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Sección: Cambio de contraseña */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 md:p-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Cambiar Contraseña</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">Nueva Contraseña</label>
                        <div className="flex items-center border border-gray-300 rounded-lg bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                            <i className="pi pi-lock text-gray-400 mr-2" aria-hidden="true" />
                            <input
                                id="newPassword"
                                name="newPassword"
                                value={formData.newPassword || ""}
                                onChange={handleInputChange}
                                type={showPassword ? "text" : "password"}
                                placeholder="Mínimo 6 caracteres"
                                className="w-full outline-none bg-transparent text-sm text-gray-700"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="ml-2 text-gray-500 hover:text-gray-700"
                                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                            >
                                <i className={`pi ${showPassword ? "pi-eye-slash" : "pi-eye"}`} />
                            </button>
                        </div>
                    </div>
                    <div className="flex items-end justify-end">
                        <ButtonOk children="Actualizar Contraseña" type="ok" onClick={handleChangePassword} disabled={loading} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Perfil;