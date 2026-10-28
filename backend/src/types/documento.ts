export interface Documento {
  id_documento: number;
  nombre: string;
  tipo: string;
  tamano: string;
  fecha_carga: Date;
  respuesta_llm: string;
  factura_id: number
}