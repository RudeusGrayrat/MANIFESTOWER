import { useEffect, useState } from "react";
import Input from "../../../ui/inputs/Input";

const Conductores = ({ set, initialData }) => {
    const [formData, setFormData] = useState({
        nombre: initialData?.nombre || "",
        licencia: initialData?.licencia || "",
    })
    useEffect(() => {
        set({
            nombre: formData.nombre,
            licencia: formData.licencia,
        })
    }, [formData])
    return (
        <div className="flex flex-wrap">
            <Input
                ancho="!w-96"
                label="Nombre del conductor"
                name="nombre"
                value={formData.nombre || ""}
                setForm={setFormData}
            />
            <Input
                label="Licencia de conducir"
                name="licencia"
                value={formData.licencia || ""}
                setForm={setFormData}
            />
        </div>
    )
}

export default Conductores;