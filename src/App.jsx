import './App.css'
import { Route, Routes, useLocation } from 'react-router'
import { Provider } from 'react-redux'
import { AuthProvider } from './components/context/AuthContext'
import Login from './components/auth/Login'
import Register from './components/auth/Register/Register'
import AuthLayout from './components/auth/Auth'

const App = () => {
  const location = useLocation();
  const path = ["/asistencia", "/"].includes(location.pathname);
  return (
    <AuthProvider>
      {/* <Suspense fallback={<Loading />}> */}
      {/* <div>
        {/* {!path && <SideBar />}
            {!path && <Nav notifications={notifications} />} */} 

      <Routes>
        <Route element={<AuthLayout title="Iniciar Sesión" />}>
          <Route path="/" element={<Login />} />
          <Route path="/registrar" element={<Register />} />
        </Route>
        {/* <Route path="/*" element={<Error />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/home" element={<Home />} />
                <Route path="/:module/:submodule" element={<Title />} />
                <Route path="/profile" element={<OtherProfiles />} />
                <Route path="/notificaciones" element={<Notificaciones />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/notas" element={<Notas />} />
              </Route> */}
      </Routes>
      {/* </div> */}
      {/* </Suspense> */}
    </AuthProvider>
  )
}

export default App
