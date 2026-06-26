import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./SideBar";
import Header from "./Header";
import { useAuth } from "../../context/AuthContext";


const MainLayout = () => {
    const { user, activeRole } = useAuth();
    return (
        <div className="flex h-screen w-screen overflow-hidden bg-[#ffffff]">
            {/* Barra lateral izquierda fija */}
            <Sidebar user={user} activeRole={activeRole} />
            {/* Contenedor derecho (Header + Canvas Dinámico) */}
            <div className="flex flex-1 flex-col overflow-hidden">
                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;