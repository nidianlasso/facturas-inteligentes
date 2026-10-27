
import express from "express";

const app = express();

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    message: "API de facturas inteligentes funcionando",
  });
});
app.post("/api/facturas", (_req, res) => {
  res.json({
    status: "ok",
    message: "Archivo recibido",
  });
});
app.get("/api/facturas", (_req, res) => {
  res.json({
    status: "ok",
    message: "lista de facturas",
  });
});
app.get("/api/facturas/{id}", (_req, res) => {
  res.json({
    status: "ok",
    message: "Detalle de la factura",
  });
});
app.put("/api/facturas/{id}", (_req, res) => {
  res.json({
    status: "ok",
    message: "factura corregida",
  });
});
app.delete("/api/facturas/{id}", (_req, res) => {
  res.json({
    status: "ok",
    message: "factura eliminada",
  });
});
app.get("/api/facturas/reportes/resumen", (_req, res) => {
  res.json({
    status: "ok",
    message: "Reporte de resumen de facturas",
  });
});

export default app;
