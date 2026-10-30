const API_URL = "/api";

export interface RespuestaFactura {
  mensaje: string;
  archivo: string;
  tamano: number;
  extension: string;
  datos: {
    fecha_emision: string | null;
    valor_total: number | null;
    moneda: string | null;
    proveedor_emisor: string | null;
    numero_factura: string | null;
    fecha_limite_pago: string | null;
    numero_cliente_contrato: string | null;
  };
}

export const cargarFacturaApi = async (
  factura: File
): Promise<RespuestaFactura> => {
  const formData = new FormData();

  formData.append("factura", factura);

  const respuesta = await fetch(`${API_URL}/facturas`, {
    method: "POST",
    body: formData,
  });

  console.log("Respuesta recibida:", respuesta);
console.log("Estado HTTP:", respuesta.status);
  const resultado = await respuesta.json();
  console.log("Datos recibidos por React:", resultado);

  if (!respuesta.ok) {
    throw new Error(
      resultado.mensaje || "Error al procesar la factura"
    );
  }

  return resultado;
};