import { Link, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

const PERMISSIONS_MATRIX = {
    ADMIN: {
        ALL: ["VER", "CREAR", "EDITAR", "ELIMINAR", "REPORTAR", "APROBAR", "DESAPROBAR", "ENVIAR"]
    },
    GENERADOR: {
        MANIFIESTOS: ["VER"],
        TRANSPORTISTAS: ["VER", "CREAR"]
    },
    TRANSPORTISTA: {
        MANIFIESTOS: ["VER", "CREAR", "EDITAR", "REPORTAR", "APROBAR", "DESAPROBAR", "ENVIAR"],
        GENERADORES: ["VER", "CREAR"]
    }
};

const OptionGlobal = ({
    ItemRegister,
    ItemList,
    module,
    ItemReporte,
    ItemSolicitudes, // 🌟 NUEVA PROP: Para el componente de vinculaciones/solicitudes
    entityName = "Registro"
}) => {
    const { user, activeRole } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();

    // Validación de acceso
    if (!activeRole) {
        return <div className="p-10 text-center">No hay rol activo. Inicia sesión nuevamente.</div>;
    }

    const rolePermissions = PERMISSIONS_MATRIX[activeRole];
    if (!rolePermissions || !rolePermissions[module]) {
        return (
            <div className="p-10 text-center text-red-500 font-medium">
                ⛔ No tienes acceso a este módulo.
            </div>
        );
    }

    const permissions = rolePermissions[module];
    const permissionCreate = permissions.includes("CREAR");
    const permissionRead = permissions.includes("VER");
    const permissionReport = permissions.includes("REPORTAR");

    const currentView = searchParams.get("select");

    useEffect(() => {
        if (!user || !activeRole) return;
        if (!currentView || currentView === "NoDisponible") {
            if (permissionRead) setSearchParams({ select: "Listar" });
            else if (permissionCreate) setSearchParams({ select: "Crear" });
            else if (permissionReport) setSearchParams({ select: "Reporte" });
            else setSearchParams({ select: "NoDisponible" });
        }
    }, [currentView, permissionRead, permissionCreate, permissionReport, user, activeRole, setSearchParams]);

    const handleOptionClick = (option) => {
        setSearchParams({ select: option });
    };

    const renderChildren = () => {
        if (!user) return <div className="p-10 text-center text-gray-500">Cargando datos...</div>;

        switch (currentView) {
            case "Crear":
                return ItemRegister ? <ItemRegister /> : "Componente de Registro no asignado";
            case "Listar":
                return ItemList ? (
                    <ItemList
                        permissionRead={permissionRead}
                        permissionEdit={permissions.includes("EDITAR")}
                        permissionDelete={permissions.includes("ELIMINAR")}
                        permissionApprove={permissions.includes("APROBAR")}
                        permissionDisapprove={permissions.includes("DESAPROBAR")}
                        permissionSend={permissions.includes("ENVIAR")}
                        user={user}
                    />
                ) : "Componente de Lista no asignado";
            case "Reporte":
                return ItemReporte ? <ItemReporte /> : "Componente de Reporte no asignado";
            case "Solicitudes": // 🌟 NUEVO CASO
                return ItemSolicitudes ? <ItemSolicitudes /> : "Componente de Solicitudes no asignado";
            case "NoDisponible":
                return <div className="p-10 text-center text-gray-500">No tienes permisos suficientes.</div>;
            default:
                return null;
        }
    };

    const getViewTitle = () => {
        if (currentView === "Listar") return `Registro Central de ${entityName}s`;
        if (currentView === "Crear") return `Nuevo ${entityName}`;
        if (currentView === "Reporte") return `Panel de Reportes`;
        if (currentView === "Solicitudes") return `Bandeja de Solicitudes de Vinculación`; // 🌟 NUEVO TÍTULO
        return "Cargando...";
    };

    return (
        <div className="w-full flex flex-col h-full">
            <div className="p-2 flex w-full items-center justify-between">
                <div className="flex flex-col gap-2 my-1">
                    {/* Breadcrumbs (Ruta de navegación) */}
                    <nav className="flex items-center gap-2 text-xl font-medium text-gray-700">
                        <Link to="/" className="flex items-center gap-1 hover:text-slate-700 cursor-pointer">
                            <i className="pi pi-home text-[20px]! mr-1.5"></i> Inicio
                        </Link>
                        <i className="pi pi-angle-right text-[10px] text-slate-400"></i>
                        <span className="capitalize">{module?.toLowerCase()}</span>
                        <i className="pi pi-angle-right text-[10px] text-slate-400"></i>
                        <span className="text-blue-800 font-semibold">{currentView}</span>
                    </nav>
                </div>

                <div className="bg-white flex items-center gap-3 my-1 rounded-xl">
                    {/* Botón de Solicitudes (Aparece al lado de Nuevo o Reporte) */}
                    {currentView === "Listar" && ItemSolicitudes && (
                        <button
                            onClick={() => handleOptionClick("Solicitudes")}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 transition-all hover:scale-105 shadow-lg text-white text-sm font-semibold rounded-xl"
                        >
                            <i className="pi pi-envelope text-xs"></i> Solicitudes
                        </button>
                    )}

                    {currentView === "Listar" && permissionCreate && (
                        <button
                            onClick={() => handleOptionClick("Crear")}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 transition-all hover:scale-105 shadow-lg text-white text-sm font-semibold rounded-xl "
                        >
                            <i className="pi pi-plus text-xs"></i> Nuevo {entityName}
                        </button>
                    )}
                    {currentView === "Listar" && permissionReport && (
                        <button
                            onClick={() => handleOptionClick("Reporte")}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 transition-all hover:scale-105 shadow-lg text-slate-700 text-sm font-semibold rounded-xl"
                        >
                            <i className="pi pi-file text-xs"></i> Ver Reportes
                        </button>
                    )}
                    {currentView !== "Listar" && permissionRead && (
                        <button
                            onClick={() => handleOptionClick("Listar")}
                            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 border transition-all hover:scale-105 shadow-lg border-slate-200 text-slate-700 text-sm font-semibold rounded-xl"
                        >
                            <i className="pi pi-arrow-left text-xs"></i> Volver al Listado
                        </button>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 transition-all">
                {renderChildren()}
            </div>
        </div>
    );
};

export default OptionGlobal;