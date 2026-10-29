import { readFile } from "node:fs/promises";
import path from "node:path";

const apiKey = process.env.API_KEY_GEMINI;

export async function uploadFile(file: Express.Multer.File) {
  if (!apiKey) {
    throw new Error("No se cuenta con API key");
  }

  const rutaArchivo = path.resolve(file.path);
  const buffer = await readFile(rutaArchivo);

  const cargaFacturaIa = await fetch(
    "https://generativelanguage.googleapis.com/upload/v1beta/files",
    {
      method: "POST",
      headers: {
        "x-goog-api-key": apiKey,
        "Content-Type": file.mimetype,
        "X-Goog-Upload-Protocol": "raw",
        "X-Goog-Upload-File-Name": file.originalname,
      },
      body: new Uint8Array(buffer),
    }
  );

  const respuestaApi = await cargaFacturaIa.json();

  if (!cargaFacturaIa.ok) {
    throw new Error(
      respuestaApi.error?.message ?? "Error al subir el archivo"
    );
  }

  return respuestaApi;
}

export async function analisisFacturaIa(fileUri: string, mimeType: string) {
    if (!apiKey) {
        throw new Error("No se cuenta apikey");
    }
    console.log("apykey" + apiKey);
    
    const apiGemini =  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
    const promp = `Analiza todas las páginas del documento adjunto e identifica los datos principales de la factura.
            Devuelve exclusivamente un objeto JSON válido, sin Markdown, bloques de código ni explicaciones, con esta estructura exacta:
            {
              "fecha_emision": "YYYY-MM-DD o null",
              "valor_total": 0.00,
              "moneda": "código ISO 4217 o null",
              "proveedor_emisor": "string o null",
              "numero_factura": "string o null",
              "fecha_limite_pago": "YYYY-MM-DD o null",
              "numero_cliente_contrato": "string o null"
            }
            REGLAS DE EXTRACCIÓN:
            1. Identifica los conceptos por su significado y contexto, no solamente por el nombre de las etiquetas. Los proveedores pueden utilizar denominaciones diferentes para representar el mismo dato.
            2. La fecha de emisión puede aparecer como fecha de expedición, fecha de factura, fecha de generación o una expresión equivalente.
            3. El valor_total debe corresponder al importe final que debe pagar el cliente. Prioriza etiquetas como "Total a pagar", "Total factura", "Importe total" o equivalentes. No confundas el total con el subtotal, los impuestos, los descuentos o los pagos parciales.
            4. Devuelve valor_total como número decimal, sin símbolos monetarios ni separadores de miles. Por ejemplo, "79,900.00" debe convertirse en 79900.00. Si no puedes identificar el importe total con suficiente certeza, devuelve null.
            5. IDENTIFICACIÓN DE LA MONEDA:
              a. Examina todas las páginas y busca códigos de moneda, símbolos, denominaciones y expresiones como COP, USD, EUR, pesos colombianos, dólares o equivalentes.
              b. Si la moneda no aparece explícitamente, analiza el contexto del documento: país, ciudad, dirección, identificación fiscal del proveedor, autoridades tributarias, legislación citada, datos comerciales y demás referencias geográficas.
              c. Utiliza esas evidencias en conjunto para inferir la moneda cuando sean suficientes y coherentes.
              d. Las referencias fiscales colombianas, como la DIAN, el NIT colombiano, el Estatuto Tributario colombiano y municipios de Colombia, pueden respaldar una inferencia de COP cuando sean coherentes y no existan indicios contradictorios.
              e. No deduzcas la moneda únicamente por el idioma, el nombre del proveedor, el país de emisión o el símbolo "$", ya que este símbolo puede representar distintas monedas.
              f. Si existen evidencias suficientes para una inferencia razonable, devuelve el código ISO 4217 correspondiente, como COP, USD o EUR.
              g. Si la evidencia es insuficiente, ambigua o contradictoria, devuelve null. Nunca inventes una moneda.
            6. proveedor_emisor debe ser el nombre de la empresa o persona que expide la factura, no el cliente, comprador o suscriptor. Busca también nombres fiscales y razones sociales.
            7. numero_factura debe conservarse exactamente como aparece, incluyendo letras, guiones, prefijos y ceros iniciales. No lo confundas con números de autorización fiscal, resolución, cliente o contrato.
            8. numero_cliente_contrato puede aparecer como número de cliente, cuenta de cliente, número de contrato, referencia de suscriptor, cuenta de servicios o una etiqueta equivalente. Devuelve el identificador que corresponda a la relación comercial entre el proveedor y el cliente. No uses automáticamente el documento de identidad del cliente si no representa ese identificador.
            9. fecha_limite_pago puede aparecer como fecha de vencimiento, fecha límite de pago, pagar antes de o una expresión equivalente. No la confundas con la fecha de emisión, la fecha de impresión, el periodo facturado o la fecha de autorización fiscal. Si no aparece, devuelve null.
            10. Examina todas las páginas, encabezados, tablas, totales, notas y secciones fiscales antes de decidir que un dato no está disponible.
            11. Los campos obligatorios también deben devolver null cuando no exista evidencia suficiente. No inventes ni completes datos mediante suposiciones.
            12. Las fechas deben expresarse como YYYY-MM-DD únicamente cuando puedan interpretarse sin ambigüedad. No conviertas fechas ambiguas mediante suposiciones.
            13. Todos los campos deben respetar los tipos definidos en el JSON. Los campos de texto deben ser strings o null, y valor_total debe ser un número o null.
            14. No agregues campos adicionales. Devuelve únicamente el objeto JSON solicitado, válido y sin texto fuera de él.`;
    
            const response = await fetch(apiGemini,{
        method: "POST",
        headers: {
            "x-goog-api-key": apiKey,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "contents": [{
                "parts": [
                    { "text": promp },
                    {file_data: {
                        mime_type: mimeType,
                        file_uri: fileUri,
                        },
                    },
                ],
            },],
            "generationConfig": {
                "responseMimeType": "application/json",
            },
        }),
    });
    const respuestaApi = await response.json();

  if (!response.ok) {
    console.error("Error de Gemini:", respuestaApi);

    throw new Error(
      respuestaApi.error?.message ??
        "Error al analizar la factura"
    );
  }

  const resultAnalisis: string =respuestaApi.candidates?.[0]?.content?.parts?.map((parte: { text?: string }) => parte.text ?? "").join("") ?? "";
  if (!resultAnalisis.trim()) {
    throw new Error("LLM no devolvió contenido");
  }
  let facturaExtraida: Record<string, string | null>;

  try {
    facturaExtraida = JSON.parse(resultAnalisis);
  } catch {
    console.error("Respuesta JSON inválida:", resultAnalisis);
    throw new Error(
      "LLM devolvió una respuesta que no es JSON válido"
    );
  }

  console.log("Factura extraída:", facturaExtraida);

  return facturaExtraida;
    

}