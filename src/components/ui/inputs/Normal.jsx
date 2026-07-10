
const InputNormal = (props) => {
  const { label, name, value, ancho, setForm, onChange, ...rest } = props;

  const handleChange = (e) => {
    if (onChange) {
      onChange(e); // ✅ usa el handler del padre
    } else if (setForm) {
      setForm((prev) => ({
        ...prev,
        [name]: e.target.value?.toUpperCase(),
      }));
    }
  };
  return (
    <div className={`responsive-input flex w-full min-w-0 flex-col h-auto min-h-20 mx-0 sm:mx-3 sm:flex-1 ${ancho === "w-full" ? "sm:basis-full" : "sm:basis-[240px]"}`}>
      <label className="text-base font-medium text-gray-700">{label}</label>
      <input
        className={`mt-1 w-full min-w-0 px-3 bg-white py-2 border border-gray-300 !text-base rounded-md shadow-sm sm:text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${ancho || ""}`}
        placeholder={label}
        name={name}
        value={value}
        onChange={handleChange} // Usamos onChange para actualizar el estado
        {...rest} // Pasamos los demás props restantes
      />
    </div>
  );
};

export default InputNormal;
