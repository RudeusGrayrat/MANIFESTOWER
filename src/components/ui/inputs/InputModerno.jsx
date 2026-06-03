// Ejemplo de cómo adaptarías tu Input para usarlo en el Register profesional
import { Controller, useFormContext } from "react-hook-form";

const InputModerno = ({ name, label, rules, ...props }) => {
    const { control } = useFormContext(); // Obtenemos el control global

    return (
        <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
                <Input
                    {...props}
                    label={label}
                    value={value}
                    onChange={onChange} // El Input original debe aceptar onChange
                    errorOnclick={!!error}
                />
            )}
        />
    );
};

export default InputModerno;