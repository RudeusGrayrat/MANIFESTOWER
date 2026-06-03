import { useState } from "react";

const CardPlegable = ({ title, children, estiloDiv = "", estiloButton = "", estiloContent = "" }) => {
  const [show, setShow] = useState(true);
  const handleShow = () => {
    setShow(!show);
  };
  return (
    <div className={`${estiloDiv} shadow-md bg-[#f3f3f3a1] rounded-lg mx-4 m-2`}>
      <button
        type="ok"
        className={`my-1 ${estiloButton} bg-[#ffffff] text-start shadow-md p-3 rounded-lg w-full font-semibold text-lg pl-6`}
        onClick={() => handleShow()}
      >
        {title}
      </button>
      <div className={`mx-4 py-3 ${estiloContent}`}>{show && children}</div>
    </div>
  );
};

export default CardPlegable;
