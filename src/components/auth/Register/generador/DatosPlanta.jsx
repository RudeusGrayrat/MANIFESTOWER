import React, { useState, useEffect } from "react";
import Input from "../../../ui/inputs/Input";
import CardPlegable from "../../../ui/cards/CardPlegable";

const DatosPlanta = ({ set, initialData }) => {
    const [ubigeoOptions, setUbigeoOptions] = useState([]);
    const [form, setForm] = useState({
        denominacion: initialData?.denominacion || "",
        tipoPlanta: initialData?.tipoPlanta || "",
        direccion: initialData?.direccion || "",
        ubigeoId: initialData?.ubigeoId || "",
        coordenadasUtm: { norte: initialData?.coordenadasUtm?.norte || "", este: initialData?.coordenadasUtm?.este || "", zona: initialData?.coordenadasUtm?.zona || "" },
        actividadEconomica: initialData?.actividadEconomica || "",
        sector: initialData?.sector || "",
        tieneIga: initialData?.tieneIga || false,
        institucionApruebaIga: initialData?.institucionApruebaIga || "",
        fechaAprobacionIga: initialData?.fechaAprobacionIga || "",
        numeroResolucionIga: initialData?.numeroResolucionIga || "",
    });
    // Opciones para tipo de planta
    const tipoPlantaOptions = [
        { name: "PRINCIPAL", code: "PRINCIPAL" },
        { name: "SECUNDARIA", code: "SECUNDARIA" },
        { name: "OPERATIVA", code: "OPERATIVA" },
        { name: "ALMACENAMIENTO", code: "ALMACENAMIENTO" },
        { name: "TRATAMIENTO", code: "TRATAMIENTO" }
    ];

    // Opciones para sector
    const sectorOptions = [
        { name: "PRIVADO", code: "PRIVADO" },
        { name: "PÚBLICO", code: "PÚBLICO" },
        { name: "MIXTO", code: "MIXTO" }
    ];

    // Manejar cambio en coordenadas
    const handleCoordenadaChange = (campo, valor) => {
        setForm(prev => ({
            ...prev,
            coordenadasUtm: {
                ...prev.coordenadasUtm,
                [campo]: valor
            }
        }));
    };
    useEffect(() => {
        set({
            denominacion: form.denominacion,
            tipoPlanta: form.tipoPlanta,
            direccion: form.direccion,
            ubigeoId: form.ubigeoId,
            coordenadasUtm: form.coordenadasUtm,
            actividadEconomica: form.actividadEconomica,
            sector: form.sector,
            tieneIga: form.tieneIga,
            institucionApruebaIga: form.institucionApruebaIga,
            fechaAprobacionIga: form.fechaAprobacionIga,
            numeroResolucionIga: form.numeroResolucionIga,
        })
    }, [form]);
    return (
        <div className="flex flex-wrap">

            {/* Denominación de la planta */}
            <Input
                label="Denominación de la planta"
                type="text"
                name="denominacion"
                value={form.denominacion}
                setForm={setForm}
                placeholder="Ej: PLANTA PRINCIPAL LIMA"
            />

            {/* Tipo de planta */}
            <Input
                label="Tipo de planta"
                name="tipoPlanta"
                value={form.tipoPlanta}
                setForm={setForm}
                placeholder="Seleccione el tipo de planta"
            />

            {/* Dirección */}
            <Input
                label="Dirección"
                type="text"
                name="direccion"
                value={form.direccion}
                setForm={setForm}
                placeholder="Dirección completa"
            />

            {/* Ubigeo - Autocomplete */}
            <Input
                label="Ubigeo"
                type="autocomplete"
                name="ubigeoId"
                value={form.ubigeoId}
                setForm={setForm}
                fetchData="/certificaciones/getUbigeoPaginacion"
                setOptions={setUbigeoOptions}
                ancho={"!w-56"}
                field={(option) => `${option.distrito} - ${option.provincia} - ${option.departamento}`}
                options={ubigeoOptions}
                placeholder="Distrito - Provincia - Departamento"
            />
            {/* Actividad Económica (CIIU) */}
            <Input
                label="Actividad Económica (CIIU)"
                type="text"
                name="actividadEconomica"
                value={form.actividadEconomica}
                setForm={setForm}
                placeholder="Ej: 0111 - CULTIVO DE CEREALES"
            />

            {/* Sector */}
            <Input
                label="Sector"
                name="sector"
                value={form.sector}
                setForm={setForm}
                placeholder="Escriba el sector"
            />
            <Input
                label="Coordenada Norte"
                type="text"
                ancho="min-w-32! w-32"
                name="coordenadaNorte"
                value={form.coordenadasUtm?.norte || ""}
                onChange={(e) => handleCoordenadaChange('norte', e.target.value)}
                placeholder="Ej: 8675432"
                mayus={false}
            />
            <Input
                label="Coordenada Este"
                type="text"
                name="coordenadaEste"
                ancho="min-w-32! w-32 "
                value={form.coordenadasUtm?.este || ""}
                onChange={(e) => handleCoordenadaChange('este', e.target.value)}
                placeholder="Ej: 362145"
                mayus={false}
            />
            <Input
                label="Zona"
                type="text"
                name="coordenadaZona"
                ancho="min-w-32! w-32"
                value={form.coordenadasUtm?.zona || ""}
                onChange={(e) => handleCoordenadaChange('zona', e.target.value)}
                placeholder="Ej: 18L"
            />
            <div className="w-full mt-3">
                <Input
                    label="¿Cuenta con IGA aprobado?"
                    type="checkbox"
                    name="tieneIga"
                    value={form.tieneIga}
                    setForm={setForm}
                    checkboxLabel="Sí, cuenta con Instrumento de Gestión Ambiental"
                />
            </div>
            {form.tieneIga && (
                <>
                    <Input
                        label="Institución que aprueba"
                        type="text"
                        name="institucionApruebaIga"
                        value={form.institucionApruebaIga}
                        setForm={setForm}
                        ancho="w-full"
                        required
                    />
                    <Input
                        label="Fecha de Aprobación"
                        type="date"
                        name="fechaAprobacionIga"
                        value={form.fechaAprobacionIga}
                        setForm={setForm}
                        ancho="w-full"
                        required
                    />
                    <Input
                        label="N° de Resolución"
                        type="text"
                        name="numeroResolucionIga"
                        value={form.numeroResolucionIga}
                        setForm={setForm}
                        ancho="w-full"
                        required
                    />
                </>
            )}
        </div>
    );
};

export default DatosPlanta;