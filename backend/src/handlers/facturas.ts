import { Request, Response } from "express";
import multer from "multer";
import {analisisFacturaIa, uploadFile} from "../llm/gemini.js"


// export const cargarFactura = async (req: Request, res: Response) => {
//   try {
//     // Prueba temporal: consultar los modelos disponibles
//     const modelos = await listarModelosGemini();

//     return res.status(200).json({
//       mensaje: "Modelos disponibles",
//       modelos: modelos
//         .filter((m: any) =>
//           m.supportedGenerationMethods?.includes("generateContent")
//         )
//         .map((m: any) => m.name)
//     });

//     // Por ahora no se ejecuta la carga del PDF.
//     // El return anterior detiene la ejecución aquí.

//   } catch (error) {
//     console.error("Error al consultar modelos:", error);

//     return res.status(500).json({
//       mensaje: "No se pudieron consultar los modelos de Gemini"
//     });
//   }
// };



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
        if(archivoCargado){
            const analisis = await analisisFacturaIa(archivoCargado.file.uri, factura.mimetype);
            console.log("análisis del documento");
            console.log(analisis)





            
        }
        return res.status(200).json({
                 message: "cargar facturas",
                 archivo: factura?.originalname,
                 tamano: factura?.size,
                 extension: factura.mimetype
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