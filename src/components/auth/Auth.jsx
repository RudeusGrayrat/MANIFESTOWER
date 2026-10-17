import { Outlet, useLocation } from "react-router-dom";
import LoadingOverlay from "../ui/cards/LoadingOverlay";
import { useAuth } from "../context/AuthContext";

const benefits = [
    { icon: "pi-shield", title: "Seguridad garantizada", text: "Tus datos siempre protegidos" },
    { icon: "pi-clock", title: "Disponible 24/7", text: "Gestiona tus operaciones en cualquier momento" },
    { icon: "pi-headphones", title: "Soporte especializado", text: "Estamos para ayudarte" },
];

const AuthLayout = () => {
    const location = useLocation();
    const { loading } = useAuth();
    const isRegister = location.pathname === "/registrar" || location.pathname === "/invitacion-generador";

    return (
        <main className="auth-page">
            {loading && <LoadingOverlay message="Iniciando sesión..." />}
            <section className={`auth-shell ${isRegister ? "auth-shell--register" : ""}`}>
            <div
                className="auth-illustration"
                style={{
                    backgroundImage: "image-set(url('/MANIFIESTO_LOGO.avif') type('image/avif') 1x, url('/MANIFIESTO_LOGO.webp') type('image/webp') 1x)",
                }}
            />
            <div
                className="auth-content"
            >
                <div className={`auth-logo ${isRegister ? "auth-logo--hidden" : ""}`}>
                    <img src="/TOWER_LOGO.svg" alt="Tower and Tower" className="h-full w-auto" />
                </div>
                <div key={location.pathname} className="auth-content__body animate-auth-fade justify-center h-full max-h-screen flex-1 flex flex-col min-h-0">
                    <Outlet />
                </div>
                <footer className="auth-benefits">
                    {benefits.map((benefit) => <div className="auth-benefit" key={benefit.title}>
                        <i className={`pi ${benefit.icon}`} aria-hidden="true" />
                        <div><strong>{benefit.title}</strong><span>{benefit.text}</span></div>
                    </div>)}
                    <p className="auth-copyright">© 2026 Tower &amp; Tower S.A. - Sistema desarrollado por Miguel Nicolas - @RudeusGrayrat</p>
                </footer>
            </div>
            </section>
        </main>
    );
};

export default AuthLayout;
