import { useEffect, useState } from "react";
import Input from "../../../ui/inputs/Input";
import InputFiles from "../../../ui/inputs/InputFiles";

const Responsables = ({ set, initialData }) => {
    console.log("InitialData en Responsables:", initialData);
    const [formData, setFormData] = useState({
        nombre: initialData?.nombre || "",
        dni: initialData?.dni || "",
        cargo: initialData?.cargo || "",
        firmaResponsable: initialData?.firmaResponsable || "",
    });
    useEffect(() => {
        set({
            nombre: formData.nombre,
            dni: formData.dni,
            cargo: formData.cargo,
            firmaResponsable: formData.firmaResponsable,
        })
    }, [formData]);
    return (
        <div className="flex flex-wrap">
            <Input
                ancho="!w-96"
                label="Nombre del Responsable"
                name="nombre"
                value={formData.nombre || ""}
                setForm={setFormData}
                placeholder="Nombres y apellidos"
            />
            <Input
                label="DNI del Responsable"
                name="dni"
                value={formData.dni || ""}
                setForm={setFormData}
                placeholder="Ej: 12345678"
            />
            <Input
                label="Cargo del Responsable"
                name="cargo"
                value={formData.cargo || ""}
                setForm={setFormData}
                placeholder="Ej: Gerente General"
            />
            <InputFiles
                label="Firma del Responsable"
                name="firmaResponsable"
                value={formData.firmaResponsable}
                setForm={setFormData}
                toBase64
            />

        </div>

    );
};

export default Responsables;