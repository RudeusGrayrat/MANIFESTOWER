import { useState, useEffect } from "react";
import Input from "../../../ui/inputs/Input";

const Contingencias = ({ formData, setFormData }) => {
    const handleChangeContingencias = (field, value) => {
        setFormData(prev => ({
            ...prev,
            contingencias: {
                ...prev.contingencias,
                [field]: value
            }
        }));
    };

    return (
        <div className="flex flex-wrap">
            <Input
                label="Derrame"
                name="contingencias.derrame"
                value={formData.contingencias?.derrame}
                onChange={(e) => handleChangeContingencias('derrame', e.target.value.toUpperCase())}
            />

            <Input
                label="Infiltración"
                name="contingencias.infiltracion"
                value={formData.contingencias?.infiltracion}
                onChange={(e) => handleChangeContingencias('infiltracion', e.target.value.toUpperCase())}
            />

            <Input
                label="Incendio"
                name="contingencias.incendio"
                value={formData.contingencias?.incendio}
                onChange={(e) => handleChangeContingencias('incendio', e.target.value.toUpperCase())}
            />

            <Input
                label="Explosión"
                name="contingencias.explosion"
                value={formData.contingencias?.explosion}
                onChange={(e) => handleChangeContingencias('explosion', e.target.value.toUpperCase())}
            />
            <Input
                label="Otros Accidentes"
                name="contingencias.otros"
                value={formData.contingencias?.otros}
                onChange={(e) => handleChangeContingencias('otros', e.target.value.toUpperCase())}
            />
        </div>
    );
};

export default Contingencias;