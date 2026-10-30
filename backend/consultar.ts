import { db } from "./src/database/conexion_db.js";

const resultado = db.prepare(`
    SELECT
        f.id_factura,
        p.nombre AS proveedor,
        p.nit,
        f.numero_factura,
        f.fecha_emision,
        f.pago_total,
        f.moneda,
        d.nombre_original
    FROM factura f
    INNER JOIN proveedor p
        ON f.id_proveedor = p.id_proveedor
    INNER JOIN documento d
        ON d.factura_id = f.id_factura;
`).all();

console.table(resultado);

db.close();