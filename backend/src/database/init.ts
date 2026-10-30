
import { db } from "./conexion_db.js";

db.exec(`
  CREATE TABLE IF NOT EXISTS proveedor (
    id_proveedor INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    nit TEXT UNIQUE,
    direccion TEXT,
    tipo TEXT CHECK (tipo IN ('privado', 'público') OR tipo IS NULL)
  );

  CREATE TABLE IF NOT EXISTS factura (
    id_factura INTEGER PRIMARY KEY AUTOINCREMENT,
    numero_factura TEXT,
    fecha_emision TEXT,
    fecha_limite_pago TEXT,
    pago_total NUMERIC,
    numero_cliente TEXT,
    moneda TEXT,
    id_proveedor INTEGER NOT NULL,
    FOREIGN KEY (id_proveedor)
      REFERENCES proveedor(id_proveedor),
    UNIQUE (id_proveedor, numero_factura)
  );

  CREATE TABLE IF NOT EXISTS documento (
    id_documento INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    tipo TEXT NOT NULL,
    tamano INTEGER NOT NULL,
    fecha_carga TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    respuesta_llm TEXT,
    factura_id INTEGER NOT NULL,
    nombre_original TEXT NOT NULL,
    nombre_defecto TEXT NOT NULL,
    FOREIGN KEY (factura_id)
      REFERENCES factura(id_factura)
  );
`);

console.log("Tablas creadas");
