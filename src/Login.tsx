import { useState } from "react";
import { supabase } from "./lib/supabaseClient";

interface LoginProps {
  onLoginSuccess: () => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [usuario, setUsuario] = useState(
    () => localStorage.getItem("usuario") || ""
  );
  const [password, setPassword] = useState(
    () => localStorage.getItem("password") || ""
  );
  const [recordar, setRecordar] = useState(() => {
    const value = localStorage.getItem("recordar");
    return value === "true";
  });
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // Validar en la tabla usuarios
    const { data, error } = await supabase
      .from("usuarios")
      .select("*")
      .eq("usuario", usuario)
      .eq("password", password)
      .single();

    if (error || !data) {
      setError("Usuario o contraseña incorrectos");
      return;
    }

    // Guardar usuario y contraseña si recordar está activado
    if (recordar) {
      localStorage.setItem("usuario", usuario);
      localStorage.setItem("password", password);
      localStorage.setItem("recordar", "true");
    } else {
      localStorage.removeItem("usuario");
      localStorage.removeItem("password");
      localStorage.setItem("recordar", "false");
    }
    // Login exitoso
    onLoginSuccess();
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900  flex-col">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">Hormiga Mesas App</h1>
      <form
        onSubmit={handleLogin}
        className="bg-gray-800 p-8 rounded-lg flex flex-col gap-4 w-80"
      >
        <h2 className="text-2xl font-bold text-white text-center">Login</h2>
        <input
          type="text"
          placeholder="Usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          className="p-2 rounded bg-gray-700 text-white focus:outline-none"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 rounded bg-gray-700 text-white focus:outline-none"
          required
        />
        <label className="flex items-center gap-2 text-white">
          <input
            type="checkbox"
            checked={recordar}
            onChange={(e) => setRecordar(e.target.checked)}
          />
          Recordar usuario y contraseña
        </label>
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          className="bg-lime-400 text-gray-900 p-2 rounded font-bold hover:bg-lime-500 transition"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
