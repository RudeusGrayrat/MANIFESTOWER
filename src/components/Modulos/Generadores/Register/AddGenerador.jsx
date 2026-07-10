import { useEffect, useState } from 'react';
import { useToast } from '../../../notificaciones/ToastContext';
import axios from '../../../api/axios';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { useAuth } from '../../../context/AuthContext';

const AddGenerador = () => {
    const { user, activeRole: rolActivo } = useAuth();
    const [generadorOptions, setGeneradorOptions] = useState([]);
    const [selectedGenerador, setSelectedGenerador] = useState(null);
    const [loading, setLoading] = useState(false);
    const [localSearch, setLocalSearch] = useState('');
    const { showSuccess, showError } = useToast();

    useEffect(() => {
        if (localSearch.trim() === '') {
            setGeneradorOptions([]);
            return;
        }
        const fetchGeneradores = async () => {
            try {
                const response = await axios.get(`/certificaciones/getGeneradoresPaginacion?search=${localSearch}`);
                setGeneradorOptions(response.data?.data || []);
            } catch (error) {
                console.error('Error fetching generadores:', error);
                showError('Hubo un error al buscar generadores. Por favor, inténtalo de nuevo.');
            }
        };
        fetchGeneradores();
    }, [localSearch, showError]);

    const handleSendRequest = async (generador) => {
        setLoading(true);
        try {
            const params = {
                transportistaId: user?._id,
                generadorId: generador._id,
                usuarioId: user?._id,
                rolActivo: rolActivo
            }
            console.log('🚀 ~ file: AddGenerador.jsx:49 ~ handleSendRequest ~ params:', params);
            const response = await axios.post('/manifesTower/postVinculacion', null, {
                params: params
            });

            setSelectedGenerador(null);
            setLocalSearch('');
            setGeneradorOptions([]);
            showSuccess(response.data?.message || `Solicitud de vinculación enviada con éxito a ${generador.razonSocial}`);
        } catch (error) {
            console.error('Error al enviar solicitud:', error);
            const errorMsg = error.response?.data?.message || 'Error al procesar la vinculación';
            showError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full mx-auto p-4 sm:p-6 bg-white rounded-xl shadow-lg border border-slate-100">
            <div className="mb-6 flex w-full flex-col sm:flex-row border-b border-gray-200 justify-between sm:items-center gap-4 pb-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 tracking-tight">Vincular Nuevo Generador (Cliente)</h2>
                    <p className="text-sm text-slate-500 mt-1">
                        Busca empresas generadoras de residuos por RUC o Razón Social para proponerles una vinculación operativa.
                    </p>
                </div>
                <IconField iconPosition="left" className="w-full sm:w-auto">
                    <InputIcon className={"pi pi-search pl-2"} />
                    <InputText
                        type="search"
                        value={localSearch}
                        placeholder="Escribe el RUC o la Razón Social..."
                        onChange={(e) => setLocalSearch(e.target.value)}
                        className="h-12 w-full sm:w-100 p-2! rounded-xl! pl-11! pr-4! border-gray-100! focus:shadow-inner! focus:translate-x-[1px] ease-in-out shadow-lg bg-gradient-to-r from-gray-50 to-gray-100"
                    />
                </IconField>
            </div>

            {/* Listado de Resultados */}
            {generadorOptions.length > 0 && !selectedGenerador && (
                <div className="mt-4">
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-1">
                        Resultados Encontrados ({generadorOptions.length})
                    </h3>
                    <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
                        {generadorOptions.map((generador) => (
                            <div
                                key={generador._id}
                                className="p-4 bg-white shadow-md border border-slate-200 rounded-xl hover:shadow-lg transition-all duration-200 cursor-pointer flex items-start justify-between gap-3 group"
                                onClick={() => setSelectedGenerador(generador)}
                            >
                                <div className="flex min-w-0 items-start gap-3">
                                    {/* Icono de edificio/fábrica para el generador */}
                                    <div className="p-2.5 bg-slate-100 rounded-lg text-slate-600 group-hover:bg-indigo-50 group-hover:text-[#285598] transition-colors">
                                        <span className="pi pi-building text-lg"></span>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-800 text-sm group-hover:text-[#285598] transition-colors line-clamp-1">
                                            {generador.razonSocial}
                                        </h4>
                                        <div className="flex flex-wrap items-center gap-2 mt-1">
                                            <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                                                RUC {generador.ruc}
                                            </span>
                                            <span className="text-xs text-slate-400">•</span>
                                            <span className="text-xs text-slate-500 line-clamp-1">
                                                {generador.direccion || 'Dirección fiscal registrada'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <span className="pi pi-chevron-right text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity self-center text-xs"></span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Panel de Confirmación */}
            {selectedGenerador && (
                <div className="mt-4 p-5 bg-gradient-to-r from-gray-50 to-gray-100 border border-indigo-50 rounded-xl shadow-md animate-fade-in">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-3">
                            <div className="p-3 bg-[#285598] text-white rounded-xl shadow-sm mt-0.5">
                                <span className="pi pi-send text-lg"></span>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 text-base">¿Confirmar propuesta de vinculación?</h3>
                                <p className="text-sm text-slate-600 mt-0.5">
                                    Vas a enviarle una solicitud de enlace a la empresa cliente <span className="font-semibold text-indigo-700">{selectedGenerador.razonSocial}</span> (RUC: {selectedGenerador.ruc}).
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2 sm:self-center w-full sm:w-auto">
                            <button
                                onClick={() => setSelectedGenerador(null)}
                                disabled={loading}
                                className="flex-1 sm:flex-initial px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-medium text-sm rounded-lg border border-slate-200 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => handleSendRequest(selectedGenerador)}
                                disabled={loading}
                                className="flex-1 sm:flex-initial px-4 py-2 bg-[#4178ca] hover:bg-[#285598] disabled:bg-blue-400 text-white font-medium text-sm rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2"
                            >
                                {loading && <span className="pi pi-spin pi-spinner text-xs"></span>}
                                Enviar Solicitud
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddGenerador;
