// src/Modules/Certificación/Manifiestos/Permissions/Detail.jsx
import { useEffect, useState } from "react";
// import { limpiarPlantilla } from "./LimpiarPlantilla";
// import renderManifiesto from "./RenderManifiesto";
import { useToast } from "../../../notificaciones/ToastContext";
import axios from "../../../api/axios";
import Details from "../../../ui/Permissions/Detail";

const DetailManifiesto = ({ setShowDetail, selected }) => {
    const miContexto = useToast();
    const [loading, setLoading] = useState(true);
    const [pdfBlob, setPdfBlob] = useState(null);

    // 🌟 2. Inicializamos el consumidor del Contexto de Toasts
    // Nota: Si en tu contexto lo exportas como un objeto { showToast } o directo como función, mapealo aquí.
    const { showError } = useToast();

    // Nombre dinámico del archivo
    const fileName = `${selected?.numeroManifiesto || 'Reporte'}_${selected?.transporte?.fechaRecepcion?.replace(/\//g, "-") || ''}`;

    useEffect(() => {
        const fetchPdf = async () => {
            if (!selected) return;

            setLoading(true);
            setPdfBlob(null);

            try {
                // Hacemos la petición al backend para que genere el PDF con LibreOffice
                const response = await axios.get(`/certificaciones/getpdfManifiesto/${selected._id}`, {
                    responseType: 'blob' // CRÍTICO: Recibir el PDF como binario
                });

                // Guardamos el archivo en el estado
                setPdfBlob(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error al obtener el PDF:", error);
                // 🌟 3. Reemplazo del viejo sendMessage por tu nuevo Toast del contexto.
                // Ajusta los parámetros al formato exacto de tu función (objeto o parámetros posicionales):
                showError("Error al generar la vista previa del PDF");
                setLoading(false);
            }
        };

        fetchPdf();
    }, [selected]);

    const handleDownload = () => {
        if (pdfBlob) {
            const url = window.URL.createObjectURL(pdfBlob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${fileName}.pdf`);
            document.body.appendChild(link);
            link.click();

            // Limpieza inmediata
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        }
    };

    const handlePreview = () => {
        if (pdfBlob) {
            const fileURL = window.URL.createObjectURL(pdfBlob);
            window.open(fileURL, '_blank');
        }
    };

    return (
        <Details setShowDetail={setShowDetail} title={`Manifiesto ${selected?.numeroManifiesto || ''}`}>
            {!loading && pdfBlob ? (
                <div className="flex gap-8 mt-6 ml-10">
                    {/* BOTÓN VISUALIZAR */}
                    <div
                        onClick={handlePreview}
                        className="bg-gradient-to-tr from-[#4378b9] to-[#57a0e6] w-60 p-2.5 text-white rounded-lg shadow-lg flex justify-center items-center cursor-pointer hover:opacity-90"
                    >
                        <span>Visualizar PDF</span>
                        <span className="ml-2 pi pi-eye"></span>
                    </div>

                    {/* BOTÓN DESCARGAR */}
                    <div
                        onClick={handleDownload}
                        className="bg-gradient-to-tr from-[#4378b9] to-[#57a0e6] text-white w-60 p-2.5 rounded-lg shadow-lg flex justify-center items-center cursor-pointer hover:opacity-90"
                    >
                        <span>Descargar PDF</span>
                        <span className="ml-2 pi pi-download"></span>
                    </div>
                </div>
            ) : (
                /* Spinner de carga mientras el i5-14600KF y LibreOffice hacen la magia */
                <div className="flex flex-col items-center mt-10">
                    <span className="pi pi-spin pi-spinner text-4xl text-blue-500 mb-4"></span>
                    <p className="text-gray-500 animate-pulse">
                        Generando documento PDF... Esto puede tardar unos segundos dependiendo de la complejidad del documento y el rendimiento del servidor.
                    </p>
                </div>
            )}
        </Details>
    );
};

export default DetailManifiesto;