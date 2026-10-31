import { db } from "../database/conexion_db.js";
import type { DatosFacturaGemini } from "../llm/gemini.js";

interface DatosDocumento {
  nombre: string;
  tipo: string;
  tamano: number;
  respuestaOriginal: string;
  nombreOriginal: string;
  nombreDefecto: string;
}
export interface DatosActualizarFactura {
  numero_factura: string;
  proveedor: string;
  nit: string | null;
  fecha_emision: string | null;
  fecha_limite_pago: string;
  pago_total: number;
  moneda: string;
  numero_cliente: string;
}

export function guardarFactura(datos: DatosFacturaGemini, documento: DatosDocumento): number {
  const transaccion = db.transaction(() => {
    const nombreProveedor = datos.proveedor_emisor ?? "Proveedor pendiente de identificar";
    let proveedor = db.prepare(`SELECT id_proveedor, nit FROM proveedor WHERE nombre = ? COLLATE NOCASE`)
        .get(nombreProveedor) as | { id_proveedor: number; nit: string | null } | undefined;
    if (!proveedor) {
      const resultado = db.prepare(`INSERT INTO proveedor (nombre, nit) VALUES (?, ?)`)
      .run(nombreProveedor, datos.nit);
      proveedor = {
        id_proveedor: Number(resultado.lastInsertRowid),
        nit:datos.nit,
      };
    }
    if (proveedor && !proveedor.nit && datos.nit) {
    db.prepare(`UPDATE proveedor SET nit = ? WHERE id_proveedor = ?`)
      .run(datos.nit, proveedor.id_proveedor);
    }
    const resultadoFactura = db.prepare(`INSERT INTO factura (fecha_emision, pago_total,moneda, numero_factura, fecha_limite_pago, numero_cliente, id_proveedor)
      VALUES (?, ?, ?, ?, ?, ?, ?)`)
      .run(
        datos.fecha_emision,
        datos.valor_total,
        datos.moneda,
        datos.numero_factura,
        datos.fecha_limite_pago,
        datos.numero_cliente_contrato,
        proveedor.id_proveedor
      );

    const facturaId = Number(resultadoFactura.lastInsertRowid);
    db.prepare(`INSERT INTO documento ( nombre, tipo, tamano, respuesta_llm, factura_id, nombre_original, nombre_defecto)
      VALUES (?, ?, ?, ?, ?, ?, ?)`)
      .run(
        documento.nombre,
        documento.tipo,
        documento.tamano,
        documento.respuestaOriginal,
        facturaId,
        documento.nombreOriginal,
        documento.nombreDefecto
      );
    return facturaId;
  });
  return transaccion();
}

export function obtenerFacturas() {
  const facturas = db.prepare(`SELECT f.id_factura, f.numero_factura, f.fecha_emision, f.fecha_limite_pago, f.pago_total, f.moneda,
     f.numero_cliente, p.nombre AS proveedor, p.nit, d.nombre AS documento, d.fecha_carga FROM factura f 
     INNER JOIN proveedor p ON f.id_proveedor = p.id_proveedor LEFT JOIN documento d ON f.id_factura = d.factura_id 
     ORDER BY f.id_factura DESC`).all();
  return facturas;
}

export function obtenerFacturaPorId(id: number) {
  return db.prepare(`SELECT f.id_factura, f.numero_factura, f.fecha_emision, f.fecha_limite_pago, f.pago_total, f.moneda, f.numero_cliente, p.nombre AS proveedor, p.nit, d.id_documento, d.nombre AS documento, d.tipo AS tipo_documento, d.tamano, d.fecha_carga, d.respuesta_llm, d.nombre_original, d.nombre_defecto 
    FROM factura f INNER JOIN proveedor p ON f.id_proveedor = p.id_proveedor LEFT JOIN documento d ON f.id_factura = d.factura_id WHERE f.id_factura = ?`)
    .get(id);
}

export function actualizarFactura(id: number, datos: DatosActualizarFactura) {
  const actualizar = db.transaction(() => {
    const factura = db.prepare(`UPDATE factura SET numero_factura = ?, fecha_emision = ?, fecha_limite_pago = ?, pago_total = ?, moneda = ?, numero_cliente = ?
      WHERE id_factura = ?`)
      .run(datos.numero_factura, datos.fecha_emision, datos.fecha_limite_pago, datos.pago_total, datos.moneda, datos.numero_cliente, id
    );

    if (factura.changes === 0) {
      throw new Error("No se encontró la factura.");
    }
    db.prepare(`UPDATE proveedor SET nombre = ?, nit = ? WHERE id_proveedor = (SELECT id_proveedor FROM factura WHERE id_factura = ?)`)
    .run(datos.proveedor, datos.nit, id
    );

    return factura;
  });

  return actualizar();
}
export function eliminarFacturaBD(id: number) {
  const transaccion = db.transaction(() => {
    db.prepare(`DELETE FROM documento WHERE factura_id = ?`).run(id);
    return db.prepare(`DELETE FROM factura WHERE id_factura = ?`)
    .run(id);
  });
  return transaccion();
}
export function obtenerResumen() {
  return db.prepare(`SELECT p.nombre AS proveedor, strftime('%Y-%m', f.fecha_emision) AS periodo, f.moneda, COUNT(f.id_factura) AS cantidad_facturas,
      SUM(f.pago_total) AS total_facturado FROM factura f INNER JOIN proveedor p ON f.id_proveedor = p.id_proveedor
      GROUP BY p.id_proveedor, periodo, f.moneda ORDER BY periodo DESC, proveedor ASC
  `).all();
}