import { useEffect, useState } from 'react';
import { useToast } from '../../../notificaciones/ToastContext';
import axios from '../../../api/axios';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { useAuth } from '../../../context/AuthContext';

const AddTransportista = () => {
    const { user, activeRole: rolActivo } = useAuth();
    const [form, setForm] = useState({ transportista: '' });
    const [transportistaOptions, setTransportistaOptions] = useState([]);
    const [selectedTransportista, setSelectedTransportista] = useState(null);
    const [loading, setLoading] = useState(false);
    const [localSearch, setLocalSearch] = useState('');
    const { showSuccess, showError } = useToast();
    useEffect(() => {
        if (localSearch.trim() === '') {
            setTransportistaOptions([]);
            return;
        }
        const fetchTransportistas = async () => {
            try {
                // Modificado para usar la ruta de paginación correcta
                const response = await axios.get(`/certificaciones/getTransportistasPaginacion?search=${localSearch}`);
                setTransportistaOptions(response.data?.data || []);
            } catch (error) {
                console.error('Error fetching transportistas:', error);
                showError('Hubo un error al buscar transportistas. Por favor, inténtalo de nuevo.');
            }
        };
        fetchTransportistas();
    }, [localSearch, showError]);

    const handleSendRequest = async (transportista) => {
        setLoading(true);
        try {
            const params = {
                transportistaId: transportista._id,
                usuarioId: user?._id,
                generadorId: user?._id,
                rolActivo: rolActivo
            }
            console.log('🚀 ~ file: AddTransportista.jsx:58 ~ handleSendRequest ~ params:', params);

            const response = await axios.post('/manifesTower/postVinculacion', null, {
                params: params
            });

            setSelectedTransportista(null);
            setForm({ transportista: '' });
            setTransportistaOptions([]);
            showSuccess(response.data?.message || `Solicitud de vinculación enviada con éxito a ${transportista.razonSocial}`);
            setLocalSearch('');
        } catch (error) {
            console.error('Error al enviar solicitud:', error);
            const errorMsg = error.response?.data?.message || 'Error al procesar la vinculación';
            showError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full mx-auto p-6 bg-white rounded-xl shadow-lg border border-slate-100">
            <div className="mb-6 flex w-full h-20 border-b border-gray-200 justify-between items-center content-center center gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 tracking-tight">Vincular Nuevo Transportista</h2>
                    <p className="text-sm text-slate-500 mt-1">
                        Busca empresas de transporte autorizadas por RUC o Razón Social para enviarles una solicitud de asociación.
                    </p>
                </div>
                <IconField iconPosition="left">
                    <InputIcon className={"pi pi-search pl-2"} />
                    <InputText
                        type="search"
                        placeholder="Escribe el RUC o la Razón Social..."
                        onChange={(e) => setLocalSearch(e.target.value)}
                        className="h-12 w-124 p-2! rounded-xl! pl-11! pr-4! border-gray-100! focus:shadow-inner! focus:translate-x-[1px] ease-in-out shadow-lg bg-gradient-to-r from-gray-50 to-gray-100"
                    />
                </IconField>
            </div>

            {/* Listado Estético de Resultados */}
            {transportistaOptions.length > 0 && !selectedTransportista && (
                <div className="mt-4">
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-1">
                        Resultados Encontrados ({transportistaOptions.length})
                    </h3>
                    <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
                        {transportistaOptions.map((transportista) => (
                            <div
                                key={transportista._id}
                                className="p-4 bg-white shadow-md border border-slate-200 rounded-xl hover:shadow-lg transition-all duration-200 cursor-pointer flex items-start justify-between gap-4 group"
                                onClick={() => setSelectedTransportista(transportista)}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="p-2.5 bg-slate-100 rounded-lg text-slate-600 group-hover:bg-indigo-50 group-hover:text-[#285598] transition-colors">
                                        <span className="pi pi-truck text-lg"></span>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-800 text-sm group-hover:text-[#285598] transition-colors line-clamp-1">
                                            {transportista.razonSocial}
                                        </h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                                                RUC {transportista.ruc}
                                            </span>
                                            <span className="text-xs text-slate-400">•</span>
                                            <span className="text-xs text-slate-500 line-clamp-1">
                                                {transportista.direccion || 'Sin dirección registrada'}
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
            {selectedTransportista && (
                <div className="mt-4 p-5 bg-gradient-to-r from-gray-50 to-gray-100 border border-indigo-50 rounded-xl shadow-md animate-fade-in">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-3">
                            <div className="p-3 bg-[#285598] text-white rounded-xl shadow-sm mt-0.5">
                                <span className="pi pi-send text-lg"></span>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 text-base">¿Confirmar solicitud de vinculación?</h3>
                                <p className="text-sm text-slate-600 mt-0.5">
                                    Estás por solicitar acceso operacional con <span className="font-semibold text-indigo-700">{selectedTransportista.razonSocial}</span> (RUC: {selectedTransportista.ruc}).
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2 sm:self-center w-full sm:w-auto">
                            <button
                                onClick={() => setSelectedTransportista(null)}
                                disabled={loading}
                                className="flex-1 sm:flex-initial px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-medium text-sm rounded-lg border border-slate-200 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => handleSendRequest(selectedTransportista)}
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

export default AddTransportista;