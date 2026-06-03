import { useEffect, useState } from "react";
import CardSideBar from "./CardSideBar";

const LeftSideBar = ({ options, handleSubmit, show }) => {
  const sortSubModules = options.submodule.sort();
  const [mostrar, setMostrar] = useState(false);

  useEffect(() => {
    setMostrar(show);
  }, [show]);
  return (
    <div
      className={`flex pt-8 p-4 flex-col items-start 
    shadow-[4px_0_8px_rgba(128,128,128,0)] shadow-gray-300 
    absolute z-50 bg-gradient-to-b from-[#455a6f] to-[#263241]
     w-80 left-20 h-screen top-0 transition-all duration-500 ${
       mostrar
         ? "opacity-100 translate-x-0 visible"
         : "opacity-0 -translate-x-4 invisible"
     }`}
    >
      <span className="pl-4 text-3xl py-4 text-white font-bold">
        {options.module}
      </span>
      {sortSubModules.map((op, i) => {
        return (
          <CardSideBar
            handleSubmit={handleSubmit}
            modulo={options.module.toLowerCase()}
            key={i}
            name={op}
            link={op.toLowerCase()}
          />
        );
      })}
    </div>
  );
};

export default LeftSideBar;
