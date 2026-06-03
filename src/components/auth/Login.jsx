import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useForm, Controller } from "react-hook-form";
import { Dropdown } from "primereact/dropdown";
import styles from "./Login.module.css";

const Login = () => {
    const navigate = useNavigate();
    const [deshabilitar, setDeshabilitar] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    // Estado local para controlar visualmente el checkbox
    const [rememberChecked, setRememberChecked] = useState(false);

    const { signin, isAuthenticated } = useAuth();

    const {
        register,
        handleSubmit,
        control,
        setValue, // Lo usaremos para actualizar el valor del form manualmente
        formState: { errors: formErrors },
    } = useForm({
        defaultValues: {
            typeUser: null,
            username: "",
            password: "",
            remember: false
        }
    });

    useEffect(() => {
        if (isAuthenticated) {
            const lastRoute = localStorage.getItem("lastRoute") || "/";
            localStorage.removeItem("lastRoute");
            navigate(lastRoute);
        }
    }, [isAuthenticated, navigate]);

    const onSubmit = async (data) => {
        console.log("Datos finales:", data);
        // Aquí iría tu signin(data)
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="gap-8 max-xl:gap-5  flex flex-col items-center justify-start">
            <h2
                style={{
                    fontFamily: "Playfair Display, serif",
                    fontWeight: "700",
                    fontSize: "45px",
                }}
                className=" text-black text-center mb-5 leading-tight">
                Inicio de sesión
            </h2>

            {/* Selector de Usuario */}
            <div className="border-b border-black/40 w-96 max-xl:w-80 focus-within:border-[#234531] transition-colors">
                <Controller
                    name="typeUser"
                    control={control}
                    rules={{ required: "Seleccione un tipo" }}
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

            {/* RUC o Usuario */}
            <div className="flex flex-col  w-96  max-xl:w-80 ">
                <input
                    {...register("username", { required: true })}
                    type="text"
                    placeholder="Ruc o usuario"
                    className="w-full bg-transparent border-b border-black/40 py-2 focus:outline-none focus:border-[#234531] transition-colors placeholder:text-gray-500"
                />
            </div>

            {/* Contraseña y Botón para mostrar/ocultar contraseña */}
            <div className="flex flex-col  w-96 max-xl:w-80 ">
                <div className="relative">
                    <input
                        {...register("password", { required: true })}
                        type={showPassword ? "text" : "password"}
                        placeholder="Contraseña"
                        className="w-full bg-transparent border-b border-black/40 py-2 focus:outline-none focus:border-[#234531] transition-colors placeholder:text-gray-500 pr-10"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-0 top-1/2 h-full -translate-y-1/2 text-gray-500 mr-4 hover:text-gray-700 transition-colors"
                    >
                        {showPassword ? (
                            <span className="pi pi-eye-slash text-xl"></span>
                        ) : (
                            <span className="pi pi-eye text-xl"></span>
                        )}
                    </button>
                </div>
            </div>

            {/* Recordar Datos (Custom Checkbox con State) */}
            <div className="flex items-center gap-3  w-96 max-xl:w-80">
                <div className="relative flex items-center justify-center">
                    <input
                        type="checkbox"
                        id="remember"
                        className="peer h-6 w-6 opacity-0 absolute cursor-pointer z-10"
                        checked={rememberChecked}
                        onChange={(e) => {
                            const val = e.target.checked;
                            setRememberChecked(val); // Actualiza la UI
                            setValue("remember", val); // Sincroniza con Hook Form
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

            <button
                type="submit"
                disabled={deshabilitar}
                className={` py-2.5  w-96 max-xl:w-80 rounded-lg  text-white transition-all 
                        ${deshabilitar ? 'bg-gray-500' : 'bg-green-900 cursor-pointer hover:bg-green-900 hover:scale-[1.02] active:scale-95'}`}
                style={{
                    fontSize: "18px",
                    textTransform: "none"
                }}
            >
                {deshabilitar ? "Cargando..." : "Ingresar"}
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
    );
};

export default Login;