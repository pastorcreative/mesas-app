import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import type { Mesa } from "../types/Mesa";

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

  async function toggleMesa(id: string, estado: boolean) {
    const { error } = await supabase
      .from("mesas")
      .update({ estado: !estado })
      .eq("id", id);

    if (error) console.error(error);
  }

  const mesasInteriores = mesas.filter((m) => m.zona === "interior");
  const mesasTerraza = mesas.filter((m) => m.zona === "terraza");

  return (
    <div className="flex gap-8 p-6">
      {/* Zona terraza (izquierda) */}
      <div className="flex flex-col gap-4">
        {[...mesasTerraza].reverse().map((mesa) => (
          <button
            key={mesa.id}
            onClick={() => toggleMesa(mesa.id, mesa.estado)}
            className={`p-6 rounded-xl text-white font-bold transition ${
              mesa.estado ? "bg-red-500" : "bg-green-500"
            }`}
          >
            {mesa.nombre}
          </button>
        ))}
      </div>

      {/* Zona interior (derecha) */}
      <div className="grid grid-cols-5 gap-4">
        {mesasInteriores.map((mesa) => (
          <button
            key={mesa.id}
            onClick={() => toggleMesa(mesa.id, mesa.estado)}
            className={`p-6 rounded-xl text-white font-bold transition ${
              mesa.estado ? "bg-red-500" : "bg-green-500"
            }`}
          >
            {mesa.nombre}
          </button>
        ))}
      </div>
    </div>
  );
}
