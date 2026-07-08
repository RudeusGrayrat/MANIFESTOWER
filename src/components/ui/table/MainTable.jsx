import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import React, { useEffect, useRef, useState } from "react";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import "./MainTable.css";
import { useNavigate, useLocation } from "react-router-dom";

const ListPrincipal = ({
    permissionEdit,
    permissionDelete,
    permissionRead,
    permissionApprove,
    permissionDisapprove,
    permissionSend,
    ApproveItem,
    DisapproveItem,
    EnviarItem,
    DeleteItem,
    EditItem,
    DetailItem,
    contenido,
    children,
    rowClick,
    onSearch,
    actionBody,
    fetchData,
    ...OtheProps
}) => {
    const dt = useRef(null);
    const [selected, setSelected] = useState(false);
    const [showDetail, setShowDetail] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showApprove, setShowApprove] = useState(false);
    const [showDisapprove, setShowDisapprove] = useState(false);
    const [showSend, setShowSend] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const [pagina, setPagina] = useState(0);
    const [limite, setLimite] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [content, setContent] = useState(contenido || []);

    // 🌟 DOS ESTADOS DE CARGA: Uno sutil para búsquedas y otro pesado para estructura
    const [loading, setLoading] = useState(false); // Bloquea la tabla entera
    const [subtleLoading, setSubtleLoading] = useState(false); // Solo hace girar la lupa

    // 🌟 CONTROL DE BÚSQUEDA DEBOUNCED
    const [localSearch, setLocalSearch] = useState(""); // Lo que se escribe al instante
    const [searchTerm, setSearchTerm] = useState("");   // Lo que realmente va al servidor
    const prevSearchRef = useRef(searchTerm);

    const [selectedRowId, setSelectedRowId] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState(null);

    // Handlers de modales heredados
    const handleShowEdit = (item) => { setSelected(item); setShowEdit(true); };
    const handleShowApprove = (item) => { setSelected(item); setShowApprove(true); setSelectedRowId(item._id); };
    const handleShowDisapprove = (item) => { setSelected(item); setShowDisapprove(true); setSelectedRowId(item._id); };
    const handleShowDelete = (item) => { setSelected(item); setShowDelete(true); setSelectedRowId(item._id); };
    const handleShowSend = (item) => { setSelected(item); setShowSend(true); setSelectedRowId(item._id); };

    const handleShowDetail = (item) => {
        setSelected(item);
        setShowDetail(true);
        setSelectedRowId(item._id);
        const searchParams = new URLSearchParams(location.search);
        searchParams.set("view", item._id);
        navigate(`${location.pathname}?${searchParams.toString()}`);
    };

    // 🌟 1. DEBOUNCE EFFECT: Espera 500ms de inactividad antes de procesar la búsqueda
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            setSearchTerm(localSearch);
            setPagina(0); // Reinicia a la primera página automáticamente al buscar
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [localSearch]);

    // 🌟 2. FUNCIÓN UNIFICADA DE CARGA (Soporta carga silenciosa)
    const loadLazyData = async (page, limit, search, isSearchOperation = false) => {
        if (!fetchData) return;

        // Si es una búsqueda, usamos el cargador sutil. Si es cambio de página/refresh, el pesado.
        if (isSearchOperation) {
            setSubtleLoading(true);
        } else {
            setLoading(true);
        }

        try {
            const result = await fetchData(page, limit, search);
            setContent(result.data || []);
            setTotalRecords(result.total || 0);
        } catch (error) {
            console.error("Error loading table data:", error);
        } finally {
            setLoading(false);
            setSubtleLoading(false);
        }
    };

    // 🌟 3. OBSERVADOR REACTIVO INTELIGENTE
    useEffect(() => {
        // Evaluamos si el cambio actual fue provocado por la barra de búsqueda
        const isSearchChange = prevSearchRef.current !== searchTerm;
        prevSearchRef.current = searchTerm;

        loadLazyData(pagina, limite, searchTerm, isSearchChange);
    }, [pagina, limite, searchTerm]);

    // Sincronización externa si pasas "contenido" por propiedad estática
    useEffect(() => {
        if (contenido) { setContent(contenido); }
    }, [contenido]);

    // Sincronización con parámetros de la URL de visualización
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const viewId = queryParams.get("view");
        if (viewId && content.length > 0) {
            const item = content.find((i) => i._id === viewId);
            if (item) {
                setSelected(item);
                setShowDetail(true);
                setSelectedRowId(item._id);
            }
        }
    }, [location.search, content]);

    // Botones de acción de las filas
    const actionBodyTemplate = (rowData) => {
        const isActivated = rowData.state === "ACTIVO" || rowData.estado === "ACTIVO";
        const isApproved = rowData.state === "APROBADO" || rowData.estado === "APROBADO" || rowData.status === "ACEPTADA" || rowData.status === "RECHAZADA";
        const isRejected = rowData.state === "RECHAZADO" || rowData.estado === "RECHAZADO" || rowData.status === "RECHAZADA" || rowData.status === "ACEPTADA";
        const isSend = isRejected || isApproved || rowData.state === "ENVIADO" || rowData.estado === "ENVIADO" || rowData.status === "ENVIADA";

        return (
            <React.Fragment>
                {permissionRead && (
                    <Button icon="pi pi-eye" title="Ver Detalle" rounded outlined className={`text-black! rounded-full mx-1! bg-[#f7f6f6bb] transition-all duration-150 ease-in-out ${selectedRowId === rowData._id && showDetail ? "shadow-inner translate-y-[2px]" : "shadow-xl"}`} onClick={() => handleShowDetail(rowData)} />
                )}
                {permissionSend && (
                    <Button icon="pi pi-send" title="Enviar" rounded outlined className={`text-blue-600! rounded-full ${isSend ? "cursor-not-allowed opacity-30" : ""} mx-1! bg-[#f7f6f6bb] transition-all duration-150 ease-in-out ${selectedRowId === rowData._id && showSend ? "shadow-inner translate-y-[2px]" : "shadow-xl"}`} onClick={() => handleShowSend(rowData)} disabled={isSend} />
                )}
                {permissionApprove && (
                    <Button icon={"pi pi-check"} title="Aprobar o Activar" rounded outlined className={`text-green-500! rounded-full ${(isApproved || isActivated) ? "cursor-not-allowed opacity-30" : ""} mx-1!  bg-[#f7f6f6bb] transition-all duration-150 ease-in-out ${selectedRowId === rowData._id && showApprove ? "shadow-inner translate-y-[2px]" : "shadow-xl"}`} onClick={() => handleShowApprove(rowData)} disabled={isApproved || isActivated} />
                )}
                {permissionDisapprove && (
                    <Button icon={"pi pi-times"} rounded title="Anular o Rechazar" outlined className={`text-orange-500! border-none! rounded-full ${(isRejected && !isActivated) ? "cursor-not-allowed opacity-30" : ""} mx-1!  bg-[#f7f6f6bb] transition-all duration-150 ease-in-out ${selectedRowId === rowData._id && showDisapprove ? "shadow-inner translate-y-[2px]" : "shadow-xl"}`} onClick={() => handleShowDisapprove(rowData)} disabled={isRejected && !isActivated} />
                )}
                {permissionEdit && (
                    <Button icon="pi pi-pencil" title="Editar" rounded outlined className={`text-blue-500! rounded-full ${isApproved || isRejected ? "cursor-not-allowed opacity-30" : ""} mx-1! bg-[#f7f6f6bb] transition-all duration-150 ease-in-out ${selectedRowId === rowData._id && showEdit ? "shadow-inner translate-y-[2px]" : "shadow-xl"}`} onClick={() => handleShowEdit(rowData)} disabled={isApproved || isRejected} />
                )}
                {permissionDelete && (
                    <Button icon="pi pi-trash" title="Eliminar" rounded outlined className={`text-red-600 rounded-full ${isApproved ? "cursor-not-allowed opacity-30" : ""} mx-1! bg-[#f7f6f6bb] transition-all duration-150 ease-in-out ${selectedRowId === rowData._id && showDelete ? "shadow-inner translate-y-[2px]" : "shadow-xl"}`} severity="danger" onClick={() => handleShowDelete(rowData)} disabled={isApproved} />
                )}
                {actionBody && actionBody(rowData)}
            </React.Fragment>
        );
    };

    // 🌟 INDICADOR VISUAL SUTIL: Cambia la lupa por un mini-spinner si está buscando o esperando el debounce
    const isSearchingActive = localSearch !== searchTerm || subtleLoading;

    const header = (
        <div className="flex flex-wrap pr-20 justify-end gap-2 ">
            <IconField iconPosition="left">
                <InputIcon className={`${isSearchingActive ? "pi pi-spin pi-spinner text-indigo-500" : "pi pi-search"} pl-2`} />
                <InputText
                    type="search"
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)} // Escritura fluida e instantánea
                    placeholder="Buscar..."
                    className="p-2 rounded-xl! pl-11! border-gray-100! focus:shadow-inner focus:translate-x-[1px]! ease-in-out shadow-lg bg-gradient-to-r! from-gray-50 to-gray-100 "
                />
            </IconField>
            {fetchData ? (
                <Button
                    icon="pi pi-refresh"
                    className="px-7! p-2! rounded-xl! border-none! text-green-600! active:shadow-inner focus:translate-x-[1px] ease-in-out shadow-lg bg-gradient-to-r! from-gray-50 to-gray-100 "
                    onClick={() => loadLazyData(pagina, limite, searchTerm, false)} // Carga pesada manual si presionan refresh
                />
            ) : null}
        </div>
    );

    return (
        <div className="flex justify-center items-center">
            {showDetail && DetailItem && <DetailItem setShowDetail={setShowDetail} selected={selected} />}
            {showSend && EnviarItem && <EnviarItem setShowSend={setShowSend} selected={selected} reload={() => loadLazyData(pagina, limite, searchTerm, true)} />}
            {showApprove && ApproveItem && <ApproveItem setShowApprove={setShowApprove} selected={selected} reload={() => loadLazyData(pagina, limite, searchTerm, true)} />}
            {showDisapprove && DisapproveItem && <DisapproveItem setShowDisapprove={setShowDisapprove} selected={selected} reload={() => loadLazyData(pagina, limite, searchTerm, true)} />}
            {showEdit && EditItem && <EditItem setShowEdit={setShowEdit} selected={selected} reload={() => loadLazyData(pagina, limite, searchTerm, true)} />}
            {showDelete && DeleteItem && <DeleteItem setShowDelete={setShowDelete} selected={selected} reload={() => loadLazyData(pagina, limite, searchTerm, true)} />}

            <div className="w-full  mt-0 border-t border-gray-100 rounded-xl! shadow-lg bg-white">
                <DataTable
                    ref={dt}
                    value={content}
                    lazy
                    selection={selectedProducts}
                    onSelectionChange={(e) => setSelectedProducts(e.value)}
                    dataKey="_id"
                    paginator
                    onRowClick={rowClick}
                    rows={limite}
                    first={pagina * limite}
                    totalRecords={totalRecords}
                    loading={loading} // 🌟 Solo se activa en cambios de página o refresh duro
                    onPage={(e) => {
                        setPagina(e.page);
                        setLimite(e.rows);
                    }}
                    rowsPerPageOptions={[5, 10, 20, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registros"
                    header={header}
                    {...OtheProps}
                >
                    <Column style={{ width: "60px" }} />
                    {children}
                    <Column body={actionBodyTemplate} exportable={false}></Column>
                </DataTable>
            </div>
        </div>
    );
};

export default ListPrincipal;