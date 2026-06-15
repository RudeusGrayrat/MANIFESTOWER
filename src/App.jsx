import React, { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

// Capa Pública e Infraestructura Básica
import MainLayout from "./components/Modulos/Home/MainLayout";
import ProtectedRoute from "./ProtectedRoute";
import AuthLayout from "./components/auth/Auth";
import LoadingOverlay from "./components/ui/cards/LoadingOverlay";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register/Register";
import Configuracion from "./components/Modulos/Configuracion/Configuracion";
import Perfil from "./components/Modulos/Perfil/Perfil";

// Capa Privada: Módulos con Carga Perezosa (Lazy Loading)
const Dashboard = lazy(() => import("./components/Modulos/Dashboard/Dashboard"));
const Transportistas = lazy(() => import("./components/Modulos/Transportistas/Transportistas"));
const Manifiestos = lazy(() => import("./components/Modulos/Manifiestos/Manifiestos"));
const Generadores = lazy(() => import("./components/Modulos/Generadores/Generadores"));

const LoadingModulo = () => (
  <div className="flex items-center justify-center h-screen bg-gray-50">
    <p className="text-gray-500 animate-pulse font-medium">Cargando módulo...</p>
  </div>
);

const router = createBrowserRouter([
  {
    // 🌟 CAPA PÚBLICA: Tu AuthLayout es el Padre Estructural
    element: <AuthLayout />,
    children: [
      {
        path: "login", // URL: /login
        element: <Login />,
      },
      {
        path: "registrar", // URL: /registrar (Coincide exacto con tu check condicional)
        element: <Register />,
      },
    ],
  },
  {
    // 2. CAPA PRIVADA (Protegida y con estructura fija)
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout /> {/* 🌟 Contiene Sidebar + Header fijados */}
      </ProtectedRoute>
    ),
    children: [
      {
        // Si entran a "/", los redirige automáticamente a "/dashboard"
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: "dashboard", // URL: /dashboard
        element: <Suspense fallback={<LoadingOverlay />}><Dashboard /></Suspense>,
      },
      {
        path: "manifiestos", // URL: /manifiestos
        element: <Suspense fallback={<LoadingOverlay />}><Manifiestos /></Suspense>,
      },
      {
        path: "transportistas", // URL: /transportistas
        element: <Suspense fallback={<LoadingModulo />}><Transportistas /></Suspense>,
      },
      {
        path: "generadores", // URL: /generadores
        element: <Suspense fallback={<LoadingModulo />}><Generadores /></Suspense>,
      },
      {
        path: "perfil",
        element: <Suspense fallback={<LoadingModulo />}><Perfil /></Suspense>
      },
      {
        path: "configuracion",
        element: <Suspense fallback={<LoadingModulo />}><Configuracion /></Suspense>
      }
    ],
  },
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}