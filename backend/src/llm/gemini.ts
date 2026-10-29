
export async function uploadFile(file: Express.Multer.File) {
  const apiKey = process.env.API_KEY_GEMINI;

  if (!apiKey) {
    throw new Error("No se cuenta apikey");
  }

  const cargaFacturaIa = await fetch("https://generativelanguage.googleapis.com/upload/v1beta/files",
    {
      method: "POST",
      headers: {
        "x-goog-api-key": apiKey,
        "Content-Type": file.mimetype,
        "X-Goog-Upload-Protocol": "raw",
        "X-Goog-Upload-File-Name": file.originalname,
      },
      body: new Uint8Array(file.buffer),
    }
  );

  const respuestaApi = await cargaFacturaIa.json();

  console.log("Status:", cargaFacturaIa.status);
  console.log("Respuesta:", respuestaApi);

  if (!cargaFacturaIa.ok) {
    throw new Error(
      respuestaApi.error?.message ?? "Error al subir el archivo"
    );
  }

  return respuestaApi;
}