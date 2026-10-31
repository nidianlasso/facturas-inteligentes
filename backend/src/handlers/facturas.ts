import { Request, Response } from "express";
import {analisisFacturaIa, uploadFile} from "../llm/gemini.js"
import { actualizarFactura, eliminarFacturaBD, guardarFactura, obtenerFacturaPorId, obtenerFacturas, obtenerResumen } from "../services/factura.services.js";

export const cargarFactura = async(req:Request, res: Response) =>{
    try{
        const factura = req.file;
        console.log("recibe la factura");
        if (!factura) {
            return res.status(400).json({
                mensaje: "No se recibió un archivo válido"
            });
        }
        const archivoCargado = await uploadFile(factura);
        console.log("llegada del api carga gemini");
        console.log(archivoCargado.file.uri);
        console.log(archivoCargado.file.mimeType);
        // if(archivoCargado){
            const analisis = await analisisFacturaIa(archivoCargado.file.uri, factura.mimetype);
            const facturaId = guardarFactura(analisis.datos, {
                nombre: factura.originalname,
                tipo: factura.mimetype,
                tamano: factura.size,
                respuestaOriginal: analisis.respuestaOriginal,
                nombreOriginal: factura.originalname,
                nombreDefecto: factura.filename,
            });
            return res.status(200).json({
                 message: "Factura cargada correctamente",
                 id: facturaId,
                 datos: analisis.datos
             });            
        // }
        
    }catch (error) {
        console.error("Error al cargar la factura:", error);
        return res.status(500).json({
            mensaje: "El archivo no puede ser cargado"
        });
    }
}

export const obtenerListaFacturas = async(req:Request, res: Response) =>{
    try{
        const facturas = obtenerFacturas();
        return res.status(200).json({
            message: "Listado de facturas exitoso",
            total: facturas.length, facturas
        });
    }catch (error) {
        console.error("Error al obtener la factura:", error);
        return res.status(500).json({
            mensaje: "Error interno del servidor"
        });
    }
}
export const obtenerFacturaId = async(req:Request, res: Response) =>{
    try{
        const idLlegada = Number(req.params.id)
        if(!Number.isInteger(idLlegada) || idLlegada<=0){
            return res.status(400).json({
                message: "El ID de la factura no es válido"
            })
        }
        console.log("Este es el id que llega " +idLlegada);
        const factura = obtenerFacturaPorId(idLlegada);
        if (!factura) {
            return res.status(404).json({
                mensaje: "Factura no encontrada"
            });
        }
        return res.status(200).json({
            message: "Factura encontrada",
            factura
        });
    }catch (error) {
        console.error("Error al obtener la factura:", error);
        return res.status(500).json({
            mensaje: "Error interno del servidor"
        });
    }
}

export const modificarFactura = async (req: Request, res: Response) => {
  try {
    const idLlegada = Number(req.params.id);

    if (!Number.isInteger(idLlegada) || idLlegada <= 0) {
      return res.status(400).json({
        mensaje: "El ID de la factura no es válido"
      });
    }

    const facturaGuardada = obtenerFacturaPorId(idLlegada);

    if (!facturaGuardada) {
      return res.status(404).json({
        mensaje: "Factura no encontrada"
      });
    }

    const {numero_factura, proveedor, nit, fecha_emision, fecha_limite_pago, pago_total, moneda, numero_cliente} = req.body;
    if (
      pago_total !== undefined &&
      pago_total !== null &&
      (typeof pago_total !== "number" ||
        !Number.isFinite(pago_total) ||
        pago_total < 0)
    ) {
      return res.status(400).json({
        mensaje: "El valor total debe ser un número válido y no negativo"
      });
    }

    const resultado = actualizarFactura(idLlegada, { numero_factura, proveedor, nit, fecha_emision, fecha_limite_pago, pago_total, moneda, numero_cliente});

    return res.status(200).json({
      mensaje: "Factura actualizada",
      cambios: resultado.changes
    });

  } catch (error) {
    console.error("Error al actualizar la factura:", error);

    return res.status(500).json({
      mensaje: "Error interno del servidor"
    });
  }
};
export const eliminarFactura = async(req:Request, res: Response) =>{
    try{
        const idLlegada = Number(req.params.id)
        if(!Number.isInteger(idLlegada) || idLlegada<=0){
            return res.status(400).json({
                message: "El ID de la factura no es válido"
            })
        }
        console.log("Este es el id que llega " +idLlegada);
        const resultado = eliminarFacturaBD(idLlegada);
        if (resultado.changes === 0) {
            return res.status(404).json({
                mensaje: "Factura no encontrada"
            });
        }
        return res.status(200).json({
            message: "Factura eliminada",
            id: idLlegada
        });
    }catch (error) {
        console.error("Error al obtener la factura:", error);
        return res.status(500).json({
            mensaje: "Error interno del servidor"
        });
    }
    

}
export const resumenFacturacion = async(req:Request, res: Response) =>{
    try{
        const resumen = obtenerResumen();
        return res.status(200).json({
            message: "Detalle de facturación",
            total: resumen.length,
            resumen
        });
    }catch (error) {
        console.error("Error al obtener la factura:", error);
        return res.status(500).json({
            mensaje: "Error interno del servidor"
        });
    }
    

}