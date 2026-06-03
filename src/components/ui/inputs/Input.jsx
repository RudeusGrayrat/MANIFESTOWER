import React, { useEffect, useRef, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { Password } from "primereact/password";
import PhoneInput from "react-phone-number-input";
import { MultiSelect } from "primereact/multiselect";
import "react-phone-number-input/style.css";
import "./stilos.css";
import "primeicons/primeicons.css";
import axios from "../../../components/api/axios";
import { AutoComplete } from "primereact/autocomplete";

const Input = ({
    setForm,
    label,
    type,
    name,
    errorOnclick,
    value,
    setError,
    ancho,
    mayus = true,
    fetchData,
    setOptions,
    otro = true,
    extraParams = {},
    disabled = false,
    optionLabel,
    ...OtherProps
}) => {
    if (setForm === undefined) {
        setForm = () => { };
    }
    const [error, setErrorState] = useState(false);
    const [animation, setAnimation] = useState(false);
    const [otroMode, setOtroMode] = useState(false);
    const [otroValor, setOtroValor] = useState("");

    const styleError = "border-red-500 animate-shake";
    const styleNormal = "border-gray-300";
    const styleConstant =
        "mt-1 px-3 py-2 border min-w-56 !text-base rounded-md shadow-sm sm:text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white";

    const estilo = `${styleConstant} ${ancho} ${animation ? styleError : styleNormal
        } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`;
    const clase = `border !mt-1 !px-1 !py-0 rounded-lg min-w-[250px] ${estilo} ${ancho} `;

    const handleAnimation = () => {
        setAnimation(true);
    };

    // Función auxiliar para determinar si un valor está "vacío" (excluye el 0)
    const isEmpty = (val) => {
        return val === undefined || val === null || val === "";
    };

    useEffect(() => {
        if (errorOnclick) {
            handleAnimation();
            setErrorState(true);
        } else {
            setAnimation(false);
            setErrorState(false);
        }
    }, [errorOnclick]);

    // Sincronización con el padre - ahora el 0 no se considera vacío
    useEffect(() => {
        if (!isEmpty(value)) {
            if (type === "multiSelect") {
                setForm(value);
            } else if (setForm && typeof setForm === "function") {
                setForm((prev) => ({ ...prev, [name]: value }));
            }
            setErrorState(false);
            setAnimation(false);
        }
    }, [value, name, setForm, type]);

    const handleChange = (e) => {
        const { value: newVal } = e.target;
        let newValue = newVal;

        // Manejo específico para type="number"
        if (type === "number") {
            newValue = newVal === "" ? "" : Number(newVal);
        }
        // Emails y correos a minúsculas
        else if (
            type === "email" ||
            type === "correo" ||
            name === "email" ||
            name === "correoElectronico" ||
            name === "username" ||
            name === "correo"
        ) {
            newValue = newVal.toLowerCase();
        }
        // Password y permisos se dejan igual
        else if (name === "password" || name === "permissions") {
            newValue = newVal;
        }
        // Autocomplete se maneja aparte
        else if (type === "autocomplete") {
            newValue = newVal;
        }
        // Si es objeto, no transformar
        else if (typeof newVal === "object") {
            newValue = newVal;
        }
        // Texto normal: aplicar mayúsculas si corresponde
        else {
            newValue = mayus ? newVal.toUpperCase() : newVal;
        }

        // Actualizar el estado interno (si se usa setForm)
        if (type === "multiSelect") {
            setForm(e.value);
        } else if (setForm && typeof setForm === "function") {
            setForm((prev) => ({ ...prev, [name]: newValue }));
        }

        // 👇 Llamar al onChange del padre si existe
        if (OtherProps.onChange && typeof OtherProps.onChange === "function") {
            OtherProps.onChange({ target: { value: newValue, name } });
        }

        // Validación de error: solo si está vacío (0 no se considera vacío)
        if (!isEmpty(newValue)) {
            setErrorState(false);
            setAnimation(false);
        } else {
            setErrorState(true);
            handleAnimation();
        }
    };

    const handleBlur = () => {
        if (isEmpty(value) && !disabled) {
            setErrorState(true);
            handleAnimation();
        }
    };

    let content;
    const debounceRef = useRef(null);

    switch (type) {
        case "multiSelect":
            content = (
                <MultiSelect
                    value={value}
                    maxSelectedLabels={OtherProps.max ? OtherProps.max : 4}
                    onChange={handleChange}
                    options={OtherProps.options}
                    display="chip"
                    placeholder="Seleccione una opción"
                    className={clase}
                />
            );
            break;

        case "phone":
            content = (
                <PhoneInput
                    value={value}
                    onChange={(val) => {
                        if (OtherProps.onChange) {
                            OtherProps.onChange({ target: { value: val, name } });
                        } else if (setForm) {
                            setForm((prev) => ({ ...prev, [name]: val }));
                        }
                        if (!isEmpty(val)) {
                            setErrorState(false);
                            setAnimation(false);
                        }
                    }}
                    className={clase}
                    placeholder={label}
                    disabled={disabled}
                />
            );
            break;

        case "password":
            content = (
                <Password
                    toggleMask
                    value={value}
                    onChange={handleChange}
                    autoComplete="new-password"
                    placeholder={label}
                    className={estilo}
                    disabled={disabled}
                />
            );
            break;

        case "autocomplete":
            let opcionesConOtro = [];
            if (otro && OtherProps?.options) {
                opcionesConOtro = [
                    ...OtherProps.options,
                    { [name]: "OTRO", value: "OTRO", label: "OTRO" },
                ];
            } else {
                opcionesConOtro = [...(OtherProps?.options || [])];
            }

            content = (
                <div className="flex items-center gap-2">
                    {!otroMode ? (
                        <AutoComplete
                            value={value}
                            suggestions={opcionesConOtro}
                            completeMethod={(e) => {
                                clearTimeout(debounceRef.current);
                                debounceRef.current = setTimeout(() => {
                                    if (e.query === "OTRO") return;
                                    let allParams = {
                                        page: 0,
                                        limit: 10,
                                        search: e.query,
                                    };
                                    if (extraParams) {
                                        allParams = { ...allParams, ...extraParams };
                                    }
                                    axios
                                        .get(fetchData, { params: allParams })
                                        .then((res) => {
                                            if (setOptions) {
                                                setOptions(res.data.data);
                                            }
                                        })
                                        .catch((err) =>
                                            console.error("Error fetching autocomplete:", err)
                                        );
                                }, 250);
                            }}
                            field={
                                typeof OtherProps.field === "function"
                                    ? "label"
                                    : OtherProps.field || name
                            }
                            itemTemplate={(item) => {
                                if (item.value === "OTRO") return "OTRO";
                                if (typeof OtherProps.field === "function") {
                                    return OtherProps.field(item);
                                }
                                return item[OtherProps.field || name];
                            }}
                            placeholder={label}
                            dropdown
                            className={estilo + " p-0!"}
                            onChange={(e) => {
                                if (e.value?.value === "OTRO") {
                                    setOtroMode(true);
                                    if (OtherProps.onChange) {
                                        OtherProps.onChange({ target: { value: "", name } });
                                    } else if (setForm) {
                                        setForm((prev) => ({ ...prev, [name]: "" }));
                                    }
                                } else {
                                    if (typeof OtherProps.field === "function" && e.value) {
                                        if (OtherProps.onChange) {
                                            OtherProps.onChange({ target: { value: e.value, name } });
                                        } else if (setForm) {
                                            setForm((prev) => ({ ...prev, [name]: e.value }));
                                        }
                                    } else {
                                        handleChange(e);
                                    }
                                }
                            }}
                            disabled={disabled}
                            {...OtherProps}
                        />
                    ) : (
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                className={estilo}
                                value={otroValor}
                                placeholder="Ingrese otro valor..."
                                onChange={(e) => {
                                    const upper = mayus
                                        ? e.target.value.toUpperCase()
                                        : e.target.value;
                                    setOtroValor(upper);
                                    if (OtherProps.onChange) {
                                        OtherProps.onChange({ target: { value: upper, name } });
                                    } else if (setForm) {
                                        setForm((prev) => ({ ...prev, [name]: upper }));
                                    }
                                }}
                                disabled={disabled}
                            />
                            <button
                                type="button"
                                className="px-2 py-1 bg-red-500 text-white rounded-full text-xs hover:bg-red-600"
                                onClick={() => {
                                    setOtroMode(false);
                                    setOtroValor("");
                                    if (OtherProps.onChange) {
                                        OtherProps.onChange({ target: { value: "", name } });
                                    } else if (setForm) {
                                        setForm((prev) => ({ ...prev, [name]: "" }));
                                    }
                                }}
                            >
                                ✕
                            </button>
                        </div>
                    )}
                </div>
            );
            break;

        case "select":
            content = (
                <Dropdown
                    className={estilo + " py-0!"}
                    value={value}
                    onChange={(e) => {
                        if (OtherProps.onChange) {
                            OtherProps.onChange(e);
                        } else {
                            handleChange(e);
                        }
                    }}
                    options={OtherProps.options}
                    placeholder={label}
                    editable={OtherProps.editable || true}
                    disabled={disabled}
                    dataKey={OtherProps.dataKey || optionLabel}
                    optionLabel={optionLabel}
                    {...OtherProps}
                />
            );
            break;

        case "checkbox":
            content = (
                <div className="flex items-center mt-2">
                    <input
                        type="checkbox"
                        checked={value || false}
                        onChange={(e) => {
                            if (OtherProps.onChange) {
                                OtherProps.onChange({ target: { checked: e.target.checked, name } });
                            } else if (setForm) {
                                setForm((prev) => ({ ...prev, [name]: e.target.checked }));
                            }
                        }}
                        className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        disabled={disabled}
                    />
                    <span className="ml-2 text-sm text-gray-600">
                        {OtherProps.checkboxLabel || label}
                    </span>
                </div>
            );
            break;

        // ✅ ELIMINAMOS EL case "number" → usamos el default

        default:
            content = (
                <input
                    type={type}
                    name={name}
                    value={value ?? ""}
                    autoComplete="off"
                    placeholder={error ? "Este campo es obligatorio" : label}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={disabled}
                    {...OtherProps}
                    className={estilo}
                />
            );
    }

    return (
        <div className="flex flex-col mx-3 F h-20" title={OtherProps.title || ""}>
            <label
                className={`text-base font-medium ${error ? "text-red-500" : "text-gray-700"
                    }`}
            >
                {error ? label + " *" : label}
            </label>
            {content}
        </div>
    );
};

export default Input;