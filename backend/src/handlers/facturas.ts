import { Request, Response } from "express";

export const cargarFactura = async(req:Request, res: Response) =>{
    try{
        return res.status(200).json({
            message: "cargar facturas",
        });
    }catch (error) {
        console.error("Error al cargar la factura:", error);
        return res.status(500).json({
            mensaje: "El archivo no puede ser cargado"
        });
    }
}
export const obtenerListaFacturas = async(req:Request, res: Response) =>{
    try{
        return res.status(200).json({
            message: "listado de facturas",
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
        console.log("Este es el id que llega " +idLlegada);
        return res.status(200).json({
            message: "El id ha sido obtenido",
            id: idLlegada
        });
    }catch (error) {
        console.error("Error al obtener la factura:", error);
        return res.status(500).json({
            mensaje: "Error interno del servidor"
        });
    }
    

}
export const modificarFactura = async(req:Request, res: Response) =>{
    try{
        const idLlegada = Number(req.params.id)
        console.log("Este es el id que llega " +idLlegada);
        return res.status(200).json({
            message: "Factura para actualizar",
            id: idLlegada
        });
    }catch (error) {
        console.error("Error al obtener la factura:", error);
        return res.status(500).json({
            mensaje: "Error interno del servidor"
        });
    }
    

}
export const eliminarFactura = async(req:Request, res: Response) =>{
    try{
        const idLlegada = Number(req.params.id)
        console.log("Este es el id que llega " +idLlegada);
        return res.status(200).json({
            message: "Factura a eliminar",
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
        return res.status(200).json({
            message: "Resumen de facturación",
        });
    }catch (error) {
        console.error("Error al obtener la factura:", error);
        return res.status(500).json({
            mensaje: "Error interno del servidor"
        });
    }
    

}