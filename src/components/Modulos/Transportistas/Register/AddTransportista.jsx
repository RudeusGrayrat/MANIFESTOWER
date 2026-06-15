import { useState } from 'react';
import Input from '../../../ui/inputs/Input';

const AddTransportista = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [transportistas, setTransportistas] = useState([]);
    const [selectedTransportista, setSelectedTransportista] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchTerm.trim()) return;

        setLoading(true);
        try {
            // TODO: Reemplazar con tu llamada a API
            // const response = await fetch(`/api/transportistas/search?q=${searchTerm}`);
            // const data = await response.json();
            // setTransportistas(data);
            setTransportistas([]);
        } catch (error) {
            console.error('Error al buscar transportista:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSendRequest = async (transportista) => {
        try {
            // TODO: Reemplazar con tu llamada a API para enviar solicitud de vinculación
            // await fetch(`/api/transportistas/${transportista.id}/request-link`, {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' }
            // });
            alert('Solicitud de vinculación enviada');
            setSelectedTransportista(null);
        } catch (error) {
            console.error('Error al enviar solicitud:', error);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Buscar y Vincular Transportista</h2>

            <form onSubmit={handleSearch} className="">
                <div className="flex gap-2">
                    <Input
                        type="autocomplete"
                        placeholder="Buscar por RUC, nombre o razón social..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 w-96! px-4  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 h-11 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
                    >
                        {loading ? 'Buscando...' : 'Buscar'}
                    </button>
                </div>
            </form>

            {transportistas.length > 0 && (
                <div className="space-y-2">
                    {transportistas.map((transportista) => (
                        <div
                            key={transportista.id}
                            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                            onClick={() => setSelectedTransportista(transportista)}
                        >
                            <p className="font-semibold">{transportista.nombre}</p>
                            <p className="text-gray-600 text-sm">RUC: {transportista.ruc}</p>
                        </div>
                    ))}
                </div>
            )}

            {selectedTransportista && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="font-semibold mb-2">Confirmar Vinculación</h3>
                    <p className="mb-4">{selectedTransportista.nombre}</p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleSendRequest(selectedTransportista)}
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                            Enviar Solicitud
                        </button>
                        <button
                            onClick={() => setSelectedTransportista(null)}
                            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AddTransportista;