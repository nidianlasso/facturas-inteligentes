import { Request, Response, NextFunction } from "express";
import multer from "multer";


const archivo = multer({
  dest: "./uploads/",
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: aceptacionExtensionArchivo,
});

export const aceptacionArchivo = (req: Request,res: Response,next: NextFunction) => {
  archivo.single("factura")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(413).json({
            mensaje: "El archivo supera el límite de 10 MB",
            });
        }

        return res.status(400).json({
            status: "error",
            mensaje: err.message,
        });
    }
    if (err) {
        if (err.message === "INVALID_FILE_TYPE") {
            return res.status(400).json({
            status: "error",
            mensaje:
                "Tipo de archivo no permitido. Solo se aceptan PDF, PNG y JPG.",
            });
        }

        return next(err);
    }
    next();
  });
};

function aceptacionExtensionArchivo( req: Request,file: Express.Multer.File,cb: multer.FileFilterCallback) {
  const extensionArchivo = ["application/pdf","image/jpeg","image/png",];
  if (extensionArchivo.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("INVALID_FILE_TYPE"));
  }
}
