export type EstadoMesa = "sin servir" | "servido bebidas" | "servido churros";

export interface Mesa {
  id: string;
  nombre: string;
  estado: EstadoMesa;
  zona: "interior" | "terraza";
}
