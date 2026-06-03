import { useEffect, useState } from "react"
import Input from "../../../ui/inputs/Input"

const GeneradoresTransportistas = ({ set, initialData }) => {
    const [generadorOptions, setGeneradorOptions] = useState()
    const [formData, setFormData] = useState({
        razonSocial: initialData || initialData?.generador || "",
    })

    useEffect(() => {
        if (formData.razonSocial) {
            set({
                _id: formData.razonSocial._id,
                razonSocial: formData.razonSocial.razonSocial
            })
        }
    }, [formData.razonSocial])
    return (
        <div className="w-full flex flex-wrap p-2">
            <Input
                label="Razon Social"
                name="razonSocial"
                ancho="!w-96"
                value={formData.razonSocial}
                fetchData="/certificaciones/getGeneradoresPaginacion"
                setOptions={setGeneradorOptions}
                options={generadorOptions}
                type="autocomplete"
                field="razonSocial"
                setForm={setFormData}

            />
            <Input
                label="RUC"
                name="ruc"
                ancho=" min-w-12 w-36"
                value={formData.razonSocial?.ruc}
                disabled
            />
            <Input
                label="Correo Electrónico"
                name="correoElectronico"
                value={formData.razonSocial?.correoElectronico}
                disabled
            />
            <Input
                label="Teléfono"
                name="telefono"
                ancho="  min-w-12 w-32"
                value={formData.razonSocial?.telefono}
                disabled
            />
            <Input
                label="Representante Legal"
                name="representanteLegal"
                value={formData.razonSocial?.representanteLegal}
                disabled
            />
            <Input
                label="DNI Representante"
                name="dniRepresentante"
                ancho="  min-w-12 w-36"
                value={formData.razonSocial?.dniRepresentante}
                disabled
            />

        </div>
    )
}

export default GeneradoresTransportistas