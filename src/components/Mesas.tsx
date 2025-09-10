import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import type { Mesa } from "../types/Mesa";
import type { EstadoMesa } from "../types/Mesa";

export default function Mesas() {
  const [mesas, setMesas] = useState<Mesa[]>([]);

  useEffect(() => {
    fetchMesas();

    const channel = supabase
      .channel("mesas-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "mesas" },
        () => fetchMesas()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchMesas() {
    const { data, error } = await supabase
      .from("mesas")
      .select("*")
      .order("nombre");

    if (error) {
      console.error(error);
      return;
    }

    setMesas(data as Mesa[]);
  }

  // Cambia el estado de la mesa en orden: sin servir -> servido bebidas -> servido churros -> sin servir
  function getNextEstado(estado: EstadoMesa): EstadoMesa {
    if (estado === "sin servir") return "servido bebidas";
    if (estado === "servido bebidas") return "servido churros";
    return "sin servir";
  }

  async function toggleMesa(id: string, estado: EstadoMesa) {
    const nuevoEstado = getNextEstado(estado);
    const { error } = await supabase
      .from("mesas")
      .update({ estado: nuevoEstado })
      .eq("id", id);

    if (error) console.error(error);
  }

  const mesasInteriores = mesas.filter((m) => m.zona === "interior");
  const mesasTerraza = mesas.filter((m) => m.zona === "terraza");

  // Invertir el orden de las mesas interiores desde la 6 en adelante
  const mesasInterioresOrdenadas = (() => {
    const primeras = mesasInteriores.slice(0, 5);
    const siguientes = mesasInteriores.slice(5).reverse();
    return [...primeras, ...siguientes];
  })();

  return (
    <div className="flex gap-8 p-6">
      {/* Zona terraza (izquierda) */}
      <div className="flex flex-col gap-4">
        {[...mesasTerraza].reverse().map((mesa) => (
          <button
            key={mesa.id}
            onClick={() => toggleMesa(mesa.id, mesa.estado)}
            className={`p-6 rounded-xl text-white font-bold transition
              ${mesa.estado === "sin servir" ? "bg-gray-500" : ""}
              ${mesa.estado === "servido bebidas" ? "bg-blue-500" : ""}
              ${mesa.estado === "servido churros" ? "bg-green-500" : ""}
            `}
          >
            {mesa.nombre}
            <span className="block text-xs mt-2">
              {mesa.estado === "sin servir" && "Sin servir"}
              {mesa.estado === "servido bebidas" && "Servido bebidas"}
              {mesa.estado === "servido churros" && "Servido churros"}
            </span>
          </button>
        ))}
      </div>

      {/* Zona interior (derecha) */}
      <div className="grid grid-cols-5 gap-4">
        {mesasInterioresOrdenadas.map((mesa) => (
          <button
            key={mesa.id}
            onClick={() => toggleMesa(mesa.id, mesa.estado)}
            className={`p-6 rounded-xl text-white font-bold transition
              ${mesa.estado === "sin servir" ? "bg-gray-500" : ""}
              ${mesa.estado === "servido bebidas" ? "bg-blue-500" : ""}
              ${mesa.estado === "servido churros" ? "bg-green-500" : ""}
            `}
          >
            {mesa.nombre}
            <span className="block text-xs mt-2">
              {mesa.estado === "sin servir" && "Sin servir"}
              {mesa.estado === "servido bebidas" && "Servido bebidas"}
              {mesa.estado === "servido churros" && "Servido churros"}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
