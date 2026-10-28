import express from "express";
import {cargarFactura, eliminarFactura, modificarFactura, obtenerFacturaId,
  obtenerListaFacturas, resumenFacturacion } from "./handlers/facturas.js";
import {aceptacionArchivo} from "./middleware/validacionArchivo.js"  


const app = express();

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    message: "API de facturas inteligentes funcionando",
  });
});

app.post("/api/facturas", aceptacionArchivo, cargarFactura);
app.get("/api/facturas", obtenerListaFacturas);
app.get("/api/facturas/:id", obtenerFacturaId);
app.put("/api/facturas/:id", modificarFactura);
app.delete("/api/facturas/:id", eliminarFactura);
app.get("/api/facturas/reportes/resumen", resumenFacturacion);

export default app;
