const Header = () => {
    return (
        <header className="flex items-center justify-between bg-[#ffffff] p-4 shadow">
            <h1 className="text-xl font-bold text-gray-900">Bienvenido a Gestower</h1>
            <div className="flex items-center space-x-4">
                <span className="text-gray-500">Usuario: Juan Pérez</span>
                <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Cerrar Sesión</button>
            </div>
        </header>
    );
}

export default Header;