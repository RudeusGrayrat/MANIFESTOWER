import React from "react";

const ButtonDiagonal = ({ text = "Button" }) => {
    return (
        <button
            className="
        relative
        w-26 h-9
        m-2
        bg-black
        text-white
        font-bold
        text-lg
        rounded-lg
        overflow-hidden
        cursor-pointer
        transition-colors
        duration-500
        hover:text-black
        group
      "
        >
            {/* Fondo diagonal animado */}
            <span
                className="
          absolute
          -left-1/4 -right-1/4
          top-0 bottom-0
          bg-white
          transform -skew-x-45 scale-x-0
          transition-transform
          duration-500
          origin-center
          group-hover:scale-x-100
          z-0
        "
            ></span>

            {/* Texto */}
            <span className="relative z-10">
                {text}
            </span>
        </button>
    );
};

export default ButtonDiagonal;
