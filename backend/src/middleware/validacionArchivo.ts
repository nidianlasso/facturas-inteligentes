import { Request, Response, NextFunction } from "express";
import multer from "multer";


const archivo = multer({
  dest: './uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024
  }
});

export const aceptacionArchivo = async(req:Request, res:Response, next: NextFunction)=>{
    archivo.single("factura")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({
          mensaje: "El archivo supera el límite de 10 MB",
        });
      }
      return res.status(400).json({
        mensaje: err.message,
      });
    }
    if (err) {
      return next(err);
    }
    next();
  });
}