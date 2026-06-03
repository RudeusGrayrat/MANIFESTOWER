import { useEffect, useState } from "react";
import ButtonOk from "../Buttons/Buttons";
const isContentEmpty = (obj) => {
    // Si no es un objeto, es null, o es un Array, no lo filtramos.
    if (typeof obj !== "object" || obj === null || Array.isArray(obj))
        return false;

    // Aquí puedes hacer la verificación estricta de objeto literal vacío:
    if (Object.keys(obj).length === 0) return true;

    // Si tienes objetos anidados con sólo campos vacíos,
    // puedes usar una verificación más profunda, pero para tu caso {} es suficiente.
    return false;
};
const Directorio = ({ ItemComponent, setForm, directory, estilos, error, data,
    addToTop = false, ...props
}) => {

    const [formData, setFormData] = useState(
        directory?.map((dir, index) => ({
            id: index + 1,
            initialData: dir,
        })) || []
    );
    const syncParent = (updated) => {
        const filteredData = updated
            .map((f) => f.initialData)
            .filter((item) => typeof item === "object" && item !== null && Object.keys(item).length > 0);
        setForm((prev) => ({ ...prev, [data]: filteredData }));
    };
    const handleAddForm = () => {
        const updated = addToTop
            ? [{ id: Date.now(), initialData: {} }, ...formData]
            : [...formData, { id: Date.now(), initialData: {} }];
        setFormData(updated);
        syncParent(updated);
    };

    const handleRemoveForm = (id) => {
        const updated = formData.filter((f) => f.id !== id);
        setFormData(updated);
        syncParent(updated);
    };

    const handleUpdateFormData = (id, newData) => {
        const updated = formData.map((f) =>
            f.id === id ? { ...f, initialData: { ...f.initialData, ...newData } } : f
        );
        setFormData(updated);
        syncParent(updated);
    };


    return (
        <div className="w-full mt-0 flex flex-col gap-4">
            {addToTop && (
                <div className="w-full">
                    <ButtonOk
                        type="ok"
                        children="+"
                        classe="w-full !from-gray-300 !to-gray-400"
                        styles="mt-2 px-20 mb-0 "
                        onClick={handleAddForm}
                    />
                </div>
            )}
            {formData?.map((form) => (
                <div
                    key={form.id}
                    className={` ${estilos} border py-4 bg-white  border-slate-200 shadow-lg rounded-xl`}
                >
                    <ItemComponent
                        initialData={form.initialData}
                        set={(newData) => handleUpdateFormData(form.id, newData)}
                        error={error}
                        {...props}
                    />
                    <ButtonOk
                        classe="w-full"
                        styles="!my-0 px-3  mx-2"
                        onClick={() => handleRemoveForm(form.id)}
                        children="X"
                    />
                </div>
            ))}
            {!addToTop && <div className="w-full">
                <ButtonOk
                    type="ok"
                    children="+"
                    classe="w-full !from-gray-300 !to-gray-400"
                    styles="mt-2 px-20 mb-0 "
                    onClick={handleAddForm}
                />
            </div>}
        </div>
    );
};

export default Directorio;
