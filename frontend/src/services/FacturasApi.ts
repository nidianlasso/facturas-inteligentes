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

export interface Factura{
  id_factura: number;
  numero_factura: string;
  proveedor: string;
  fecha_emision: string | null;
  fecha_limite_pago: string;
  pago_total: number;
  moneda: string;
  numero_cliente: string;
  nit: string | null;
  documento: string;
}
export interface RespuestaListaFacturas {
  mensaje: string;
  total: number;
  facturas: Factura[];
}

export type ActualizarFactura = Pick<
  Factura,
  | "numero_factura"
  | "proveedor"
  | "nit"
  | "fecha_emision"
  | "fecha_limite_pago"
  | "pago_total"
  | "moneda"
  | "numero_cliente"
>;



export const cargarFacturaApi = async (factura: File): Promise<RespuestaFactura> => {
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

export const listaFacturasApi = async (): Promise<RespuestaListaFacturas> =>{
  const listaFactura = await fetch(`${API_URL}/facturas`);
  const resultadoListado = await listaFactura.json();

  if (!listaFactura.ok) {
    throw new Error(
      resultadoListado.mensaje || "Error al consultas las facturas"
    );
  }
  return resultadoListado;
} 

export const buscarFacturaPorIdApi = async (id: number) => {
  const buscarFactura = await fetch(`${API_URL}/facturas/${id}`);
  const facturaBuscada = await buscarFactura.json();
  if (!buscarFactura.ok) {
    throw new Error(
      facturaBuscada.mensaje || "No se encontró la factura."
    );
  }
  return facturaBuscada.factura;
};

export const eliminarFacturaApi = async (id: number) => {
  const respuesta = await fetch(`${API_URL}/facturas/${id}`, {
    method: "DELETE",
  });
  const resultado = await respuesta.json();
  if (!respuesta.ok) {
    throw new Error(
      resultado.mensaje || "No se pudo eliminar la factura."
    );
  }
  return resultado;
};

export const actualizarFacturaApi = async (id: number, datos: ActualizarFactura) => {
  const respuesta = await fetch(`${API_URL}/facturas/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datos),
  });

  const resultado = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(
      resultado.mensaje || "No se pudo actualizar la factura."
    );
  }
  return resultado;
};