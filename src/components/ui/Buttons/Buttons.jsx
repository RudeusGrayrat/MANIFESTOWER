import React from "react";

const ButtonOk = ({
  type,
  children,
  onClick,
  styles,
  classe,
  stylesButton,
  ...OtherProps
}) => {
  //necesito darle stilo cuando esté deshabilitado, será un gris y no tendrá el efecto hover

  // si está deshabilitado, aplicar estilo gris y quitar efectos hover/scale
  const isDisabled = OtherProps.disabled || false;

  const color = isDisabled
    ? "bg-gray-400 text-white cursor-not-allowed"
    : type === "ok"
      ? "bg-gradient-to-r from-[#2b5993] to-[#306fa8] hover:scale-105 transition-all duration-300  hover:from-[#418fda] hover:to-[#418fda]"
      : "bg-gradient-to-r from-[#FF0000] to-[#FF382E] hover:scale-105 transition-all duration-300  hover:from-[#FF382E] hover:to-[#FF382E] hover:bg-red-500";
  return (
    <div className={` ${styles ? styles : "m-4 px-8  mx-4 "} `}>
      <button
        onClick={onClick}
        className={`${color} ${classe} cursor-pointer  text-white px-4 py-2 rounded-md`}
        {...OtherProps}
        disabled={isDisabled}
      >
        {children}
      </button>
    </div>
  );
};

export default ButtonOk;
