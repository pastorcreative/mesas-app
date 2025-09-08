import { useState } from "react";
import Mesas from "./components/Mesas";
import Login from "./Login";

function App() {
  const [isLogged, setIsLogged] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  if (!isLogged) {
    return <Login onLoginSuccess={() => setIsLogged(true)} />;
  }

  return (
    <div className="relative min-h-screen">
      {/* Menú flotante */}
      <div className="fixed top-4 right-4 z-50">
        <button
          className="bg-gray-800 text-white rounded-full px-4 py-2 shadow-lg flex items-center gap-2 hover:bg-gray-700"
          onClick={() => setMenuOpen((v) => !v)}
        >
          
          Menú
        </button>
        {menuOpen && (
          <div className="mt-2 bg-white rounded-lg text-right shadow-lg py-2 px-4 min-w-[160px] flex flex-col gap-2 absolute right-0">
            <button
              className="text-left w-full px-2 py-1 rounded hover:bg-gray-100 text-gray-800"
              onClick={() => { setIsLogged(false); setMenuOpen(false); }}
            >
              Cerrar sesión
            </button>
            {/* Aquí puedes añadir más opciones en el futuro */}
          </div>
        )}
      </div>
      <Mesas />
    </div>
  );
}

export default App;
