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
    const { signin, isAuthenticated, isLoading: authLoading } = useAuth();
    const { register, handleSubmit, control, setValue, formState: { errors } } = useForm({
        defaultValues: { typeUser: null, ruc: "", password: "", remember: false }
    });

    useEffect(() => {
        const savedRuc = localStorage.getItem("remembered_ruc");
        const savedTypeUser = localStorage.getItem("remembered_typeUser");
        if (savedRuc && savedTypeUser) {
            setValue("ruc", savedRuc);
            setValue("typeUser", savedTypeUser);
            setValue("remember", true);
        }
    }, [setValue]);

    useEffect(() => {
        if (isAuthenticated) {
            const lastRoute = localStorage.getItem("lastRoute") || "/";
            localStorage.removeItem("lastRoute");
            navigate(lastRoute);
        }
    }, [isAuthenticated, navigate]);

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
            } else alert(result.message);
        } catch (error) { alert(error.message || "Error al iniciar sesión"); }
    };

    return (
        <div className="relative w-full flex justify-center">
            {authLoading && <LoadingOverlay />}
            <form onSubmit={handleSubmit(onSubmit)} noValidate className={styles.form}>
                <h2 className={styles.title}>Inicio de sesión</h2>

                <div className={styles.field}>
                    <label className={styles.label}>Tipo de cuenta</label>
                    <div className={`${styles.control} ${styles.select}`}>
                        <i className={`pi pi-user ${styles.icon}`} aria-hidden="true" />
                        <Controller name="typeUser" control={control} rules={{ required: "Seleccione un tipo de usuario" }} render={({ field }) => (
                            <Dropdown {...field}
                             options={["GENERADOR", "TRANSPORTISTA"]} placeholder="Selecciona una opción" className="w-full h-full bg-transparent! border-none! focus:ring-0!" pt={{ root: { className: "border-none! bg-transparent! shadow-none!" },
                             input: { className: "pl-10! mt-1! bg-transparent! text-gray-800! placeholder:text-gray-500! text-sm!" }, trigger: { className: "text-gray-500" } }} />
                        )} />
                    </div>
                    {errors.typeUser && <p className={styles.error}>{errors.typeUser.message}</p>}
                </div>

                <div className={styles.field}>
                    <label htmlFor="ruc" className={styles.label}>Usuario</label>
                    <div className={styles.control}>
                        <i className={`pi pi-user ${styles.icon}`} aria-hidden="true" />
                        <input id="ruc" {...register("ruc", { required: "El número de RUC es requerido" })} type="text" placeholder="Ingresa tu usuario" className={styles.input} />
                    </div>
                    {errors.ruc && <p className={styles.error}>{errors.ruc.message}</p>}
                </div>

                <div className={styles.field}>
                    <label htmlFor="password" className={styles.label}>Contraseña</label>
                    <div className={styles.control}>
                        <i className={`pi pi-lock ${styles.icon}`} aria-hidden="true" />
                        <input id="password" {...register("password", { required: "La contraseña es requerida" })} type={showPassword ? "text" : "password"} placeholder="Ingresa tu contraseña" className={styles.input} />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className={styles.passwordButton} aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}><i className={`pi ${showPassword ? "pi-eye-slash" : "pi-eye"}`} /></button>
                    </div>
                    {errors.password && <p className={styles.error}>{errors.password.message}</p>}
                </div>

                <label className={styles.remember}><input type="checkbox" {...register("remember")} /> Recordar datos</label>
                <button type="submit" disabled={authLoading} className={styles.submit}>{authLoading ? "Cargando..." : "Ingresar"}</button>
                <p className={styles.register}>¿No tienes una cuenta? <Link to="/registrar">Regístrate</Link></p>
            </form>
        </div>
    );
};
export default Login;
