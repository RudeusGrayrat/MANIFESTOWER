import ReactDOM from "react-dom/client";
// import store from "./redux/store.js";
import { BrowserRouter } from "react-router-dom";
// import { Provider } from "react-redux";
import { PrimeReactProvider } from "primereact/api";
import "./index.css";
import "primereact/resources/themes/saga-green/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import App from "./App.jsx";
import { AuthProvider } from "./components/context/AuthContext.jsx";

// 🌟 IMPORTA TU NUEVO PROVEEDOR DE ALERTAS (Ajusta la ruta según dónde guardaste el archivo)
import { ToastProvider } from "././components/notificaciones/ToastContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <Provider store={store}>

  // 🌟 COLOCAMOS EL TOASTPROVIDER EN EL TOP
  <ToastProvider>
    <AuthProvider>
      <PrimeReactProvider>
        <App />
      </PrimeReactProvider>
    </AuthProvider>
  </ToastProvider>
  // </Provider>
);