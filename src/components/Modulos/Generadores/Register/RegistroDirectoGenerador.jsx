import FichaGenerador from "./FichaGenerador";

// La ficha completa concentra el alta y la edición. El formulario legado
// quedó inalcanzable desde que se habilitaron plantas y responsables múltiples.
const RegistroDirectoGenerador = ({ onBack, generador, onSaved }) => (
    <FichaGenerador initial={generador} onBack={onBack} onSaved={onSaved} />
);

export default RegistroDirectoGenerador;
