import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useForm, Controller } from "react-hook-form";
import { Dropdown } from "primereact/dropdown";
import styles from "./Login.module.css";
import LoadingOverlay from "../ui/cards/LoadingOverlay";

const Login = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    // Estado local para controlar visualmente el checkbox
    const [rememberChecked, setRememberChecked] = useState(false);

    const { signin, isAuthenticated, isLoading: authLoading } = useAuth();

    const {
        register,
        handleSubmit,
        control,
        setValue, // Permite actualizar los valores del formulario manualmente
        formState: { errors },
    } = useForm({
        defaultValues: {
            typeUser: null,
            ruc: "",
            password: "",
            remember: false
        }
    });

    // 🌟 EFECTO 1: Recuperar credenciales guardadas al cargar la pantalla
    useEffect(() => {
        const savedRuc = localStorage.getItem("remembered_ruc");
        const savedTypeUser = localStorage.getItem("remembered_typeUser");

        if (savedRuc && savedTypeUser) {
            setValue("ruc", savedRuc);
            setValue("typeUser", savedTypeUser);
            setValue("remember", true);
            setRememberChecked(true); // Sincroniza el diseño del checkbox personalizado
        }
    }, [setValue]);

    // EFECTO 2: Redirección si ya está autenticado
    useEffect(() => {
        if (isAuthenticated) {
            const lastRoute = localStorage.getItem("lastRoute") || "/";
            localStorage.removeItem("lastRoute");
            navigate(lastRoute);
        }
    }, [isAuthenticated, navigate]);

    // 🌟 MANEJADOR: Guardar o limpiar datos según la elección del usuario
    const onSubmit = async (data) => {
        try {
            const result = await signin(data);

            if (result.success) {
                if (data.remember) {
                    localStorage.setItem("remembered_ruc", data.ruc);
                    localStorage.setItem("remembered_typeUser", data.typeUser);
                } else {
                    localStorage.removeItem("remembered_ruc");
                    localStorage.removeItem("remembered_typeUser");
                }
            } else {
                alert(result.message);
            }
        } catch (error) {
            alert(error.message || "Error al iniciar sesión");
        }
    };

    const mostrarCargando = authLoading;

    return (
        <div className="relative w-full">
            {/* Pantalla de carga integrada */}
            {mostrarCargando && <LoadingOverlay />}

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="gap-6 max-xl:gap-4 flex flex-col items-center justify-start">
                <h2
                    style={{
                        fontFamily: "Playfair Display, serif",
                        fontWeight: "700",
                        fontSize: "45px",
                    }}
                    className="text-black text-center mb-2 leading-tight">
                    Inicio de sesión
                </h2>

                {/* Selector de Usuario */}
                <div className="w-96 max-xl:w-80">
                    <div className="border-b border-black/40 focus-within:border-[#234531] transition-colors">
                        <Controller
                            name="typeUser"
                            control={control}
                            rules={{ required: "Seleccione un tipo de usuario" }}
                            render={({ field }) => (
                                <Dropdown
                                    {...field}
                                    options={["GENERADOR", "TRANSPORTISTA"]}
                                    placeholder="Tipo de Usuario"
                                    className={styles.input + ` w-full bg-transparent! border-none! focus:ring-0!`}
                                    pt={{
                                        root: {
                                            className: ` border-none! bg-transparent! shadow-none! [&.p-focus]:shadow-none! [&.p-focus]:border-none! [&.p-inputwrapper-focus]:shadow-none! `
                                        },
                                        input: { className: "px-0! bg-transparent! text-gray-800 text-black! placeholder:text-gray-500!" },
                                        trigger: { className: "text-gray-500" }
                                    }}
                                />
                            )}
                        />
                    </div>
                    {errors.typeUser && <p className="text-red-600 text-xs mt-1 pl-1">{errors.typeUser.message}</p>}
                </div>

                {/* RUC */}
                <div className="flex flex-col w-96 max-xl:w-80">
                    <input
                        {...register("ruc", { required: "El número de RUC es requerido" })}
                        type="text"
                        placeholder="RUC de la empresa"
                        className="w-full bg-transparent border-b border-black/40 py-2 focus:outline-none focus:border-[#234531] transition-colors placeholder:text-gray-500"
                    />
                    {errors.ruc && <p className="text-red-600 text-xs mt-1 pl-1">{errors.ruc.message}</p>}
                </div>

                {/* Contraseña */}
                <div className="flex flex-col w-96 max-xl:w-80">
                    <div className="relative">
                        <input
                            {...register("password", { required: "La contraseña es requerida" })}
                            type={showPassword ? "text" : "password"}
                            placeholder="Contraseña"
                            className="w-full bg-transparent border-b border-black/40 py-2 focus:outline-none focus:border-[#234531] transition-colors placeholder:text-gray-500 pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-0 top-1/2 h-full -translate-y-1/2 text-gray-500 mr-4 hover:text-gray-700 transition-colors"
                        >
                            <span className={`pi ${showPassword ? "pi-eye-slash" : "pi-eye"} text-xl`}></span>
                        </button>
                    </div>
                    {errors.password && <p className="text-red-600 text-xs mt-1 pl-1">{errors.password.message}</p>}
                </div>

                {/* Recordar Datos */}
                <div className="flex items-center gap-3 w-96 max-xl:w-80">
                    <div className="relative flex items-center justify-center">
                        <input
                            type="checkbox"
                            id="remember"
                            className="peer h-6 w-6 opacity-0 absolute cursor-pointer z-10"
                            checked={rememberChecked}
                            onChange={(e) => {
                                const val = e.target.checked;
                                setRememberChecked(val);
                                setValue("remember", val); // Sincroniza con el estado interno de React Hook Form
                            }}
                        />

                        {/* El cuadro decorativo reacciona al estado de React */}
                        <div className={`h-5 w-5 border-2 rounded-sm transition-all duration-200 flex items-center justify-center
                                    ${rememberChecked
                                ? "bg-[#2d2d2d] border-[#2d2d2d]"
                                : "bg-white/20 border-black/40"}`}
                        >
                            {rememberChecked && (
                                <svg
                                    className="w-3.5 h-3.5 text-white transition-opacity duration-200"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </div>
                    </div>

                    <label htmlFor="remember" className="text-gray-800 cursor-pointer select-none text-lg">
                        Recordar datos
                    </label>
                </div>

                {/* Botón de ingreso */}
                <button
                    type="submit"
                    disabled={mostrarCargando}
                    className={`py-2.5 w-96 max-xl:w-80 rounded-lg text-white transition-all 
                        ${mostrarCargando ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-900 cursor-pointer hover:bg-green-950 hover:scale-[1.02] active:scale-95'}`}
                    style={{
                        fontSize: "18px",
                        textTransform: "none"
                    }}
                >
                    {mostrarCargando ? "Cargando..." : "Ingresar"}
                </button>

                <div className="text-center">
                    <Link
                        to="/registrar"
                        className="text-sm text-gray-600 hover:text-black transition-colors underline-offset-4 hover:underline"
                    >
                        ¿No tienes una cuenta? Regístrate
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default Login;