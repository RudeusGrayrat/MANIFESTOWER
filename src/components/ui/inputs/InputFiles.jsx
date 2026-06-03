import React, { useEffect, useState } from "react";

const InputFiles = ({
    label,
    name,
    errorOnclick,
    ancho,
    setForm,
    type,
    toBase64 = true,
    value,
    multiple = false, // Mantiene retrocompatibilidad con strings únicos
}) => {
    // 🚫 Eliminamos el useDispatch de Redux

    const [animation, setAnimation] = useState(false);
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [previews, setPreviews] = useState([]);
    const [nameFile, setNameFile] = useState(""); // Estado original para modo simple

    const styleError = "border-red-500 animate-shake";
    const styleNormal = "border-gray-300";
    const styleConstant =
        "mt-1 px-3 py-2 bg-white border rounded-md shadow-sm sm:text-sm focus:outline-none";
    const estilo = `${styleConstant} ${ancho} ${animation ? styleError : styleNormal}`;

    useEffect(() => {
        if (errorOnclick) {
            setAnimation(true);
            setError(true);
        } else {
            setAnimation(false);
            setError(false);
        }
    }, [errorOnclick]);

    // Sincronizar previews dinámicamente conservando nombres originales
    useEffect(() => {
        if (!value || (multiple && Array.isArray(value) && value.length === 0)) {
            setPreviews([]);
            if (!multiple) setNameFile("");
            return;
        }

        if (multiple) {
            const currentPreviews = value.map((val, idx) => {
                if (!val) return null;

                if (typeof val === "object" && val.fileData) {
                    const url = val.fileData.startsWith("data:image") ? val.fileData : URL.createObjectURL(val.fileData);
                    return { id: idx, url, name: val.fileName, isFile: val.fileData instanceof File };
                }
                if (typeof val === "string") {
                    return { id: idx, url: val, name: val.split("/").pop(), isFile: false };
                }
                return null;
            }).filter(Boolean);

            setPreviews(currentPreviews);

            return () => {
                currentPreviews.forEach((p) => {
                    if (p.isFile) URL.revokeObjectURL(p.url);
                });
            };
        } else {
            if (typeof value === "string" && value.startsWith("http")) {
                setPreviews([{ id: 0, url: value, name: value.split("/").pop() }]);
                setNameFile(value.split("/").pop());
                return;
            }
            if (typeof value === "string" && value.startsWith("data:image")) {
                setPreviews([{ id: 0, url: value, name: nameFile || "Imagen.png" }]);
                return;
            }
            if (value instanceof File) {
                const url = URL.createObjectURL(value);
                setPreviews([{ id: 0, url, name: value.name }]);
                setNameFile(value.name);
                return () => URL.revokeObjectURL(url);
            }
        }
    }, [value, multiple]);

    // Manejar la carga de archivos conservando metadatos
    const handleChange = async (e, indexToReplace = null) => {
        try {
            const file = e.target.files[0];
            if (!file) {
                if (!multiple) {
                    setError(true);
                    setAnimation(true);
                    setErrorMessage("Este campo es obligatorio");
                }
                return;
            }

            if (!multiple) setNameFile(file.name);
            setIsLoading(true);

            const validFiles = type || ["image/jpeg", "image/png", "image/jpg"];

            if (!validFiles.includes(file.type)) {
                setError(true);
                setAnimation(true);
                setErrorMessage("Tipo de archivo no permitido");
                setIsLoading(false);
                return;
            }

            const processFile = () => {
                return new Promise((resolve) => {
                    if (toBase64) {
                        const reader = new FileReader();
                        reader.onload = () => resolve(reader.result);
                        reader.readAsDataURL(file);
                    } else {
                        resolve(file);
                    }
                });
            };

            const fileData = await processFile();

            setForm((prev) => {
                if (multiple) {
                    const currentArray = Array.isArray(prev[name]) ? [...prev[name]] : [];
                    const payload = { fileData, fileName: file.name };

                    if (indexToReplace !== null) {
                        currentArray[indexToReplace] = payload;
                    } else {
                        currentArray.push(payload);
                    }
                    return { ...prev, [name]: currentArray };
                } else {
                    return { ...prev, [name]: fileData };
                }
            });

            setIsLoading(false);
            setError(false);
            setAnimation(false);
            setErrorMessage("");
            e.target.value = null;
        } catch (err) {
            // 🌟 Cambiado: Ahora maneja el error internamente usando sus propios estados
            setError(true);
            setAnimation(true);
            setErrorMessage("Error al cargar el archivo");
            setIsLoading(false);
        }
    };

    // Eliminar archivos
    const handleDelete = (index) => {
        setForm((prev) => {
            if (multiple) {
                return {
                    ...prev,
                    [name]: prev[name].filter((_, i) => i !== index),
                };
            } else {
                setNameFile("");
                return {
                    ...prev,
                    [name]: null,
                };
            }
        });
    };

    return (
        <div className={"flex flex-col mx-3 min-h-24" + (multiple ? " w-full" : "")}>
            {/* LABEL */}
            <label className={`text-base font-medium ${error ? "text-red-500" : "text-gray-700"}`}>
                {label}
            </label>

            <div className="flex flex-wrap gap-3 items-center mt-1">
                {(!previews.length || multiple) && (
                    <label className={`${estilo} !p-2.5 flex items-center justify-center gap-4 cursor-pointer w-64 border-dashed border-2`}>
                        <i className="pi pi-plus"></i>
                        {multiple ? "Añadir archivo" : "Nuevo archivo"}
                        <input
                            type="file"
                            className="hidden"
                            onChange={(e) => handleChange(e)}
                            accept={Array.isArray(type) ? type.join(",") : type || "image/*"}
                        />
                    </label>
                )}

                {/* RENDERIZADO DE PREVIEWS */}
                {previews.map((preview, idx) => (
                    <div key={idx} className={`${estilo} flex items-center justify-between !p-2.5 w-64`}>
                        <div className="flex items-center">
                            <a
                                href={preview.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm truncate max-w-[160px]"
                            >
                                {preview.name}
                            </a>
                        </div>

                        <div className="gap-2 flex mx-1 items-center">
                            <span className={`mx-1 text-green ${isLoading ? "pi pi-spinner pi-spin" : ""}`}></span>
                            {!isLoading && (
                                <>
                                    {/* Reemplazar */}
                                    <label className="cursor-pointer pi pi-pencil m-0">
                                        <input
                                            type="file"
                                            accept={Array.isArray(type) ? type.join(",") : type || "image/*"}
                                            className="hidden"
                                            onChange={(e) => handleChange(e, idx)}
                                        />
                                    </label>

                                    {/* Eliminar */}
                                    <button
                                        type="button"
                                        className="pi pi-trash border-none bg-transparent cursor-pointer"
                                        onClick={() => handleDelete(idx)}
                                    ></button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* ERROR */}
            {error && (
                <span className="text-red-500 text-xs mt-1">
                    {errorMessage || "Este campo es obligatorio"}
                </span>
            )}
        </div>
    );
};

export default InputFiles;