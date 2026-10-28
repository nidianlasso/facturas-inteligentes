export interface Proveedor {
  id_proveedor: number;
  nombre: string;
  nit: string;
  direccion: string;
  tipo: "privado" | "público";
}