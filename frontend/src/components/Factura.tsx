
import { useRef, useState } from "react";
import type { ChangeEvent, DragEvent } from "react";
import { cargarFacturaApi } from "../services/FacturasApi";

function Factura() {
  const [facturaSeleccionada, setFacturaSeleccionada] = useState<File | null>(null);
  const [progreso, setProgreso] = useState(0);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const inputArchivo = useRef<HTMLInputElement>(null);

  const cargarFactura = (factura?: File) => {
    if (!factura) return;
    const tiposPermitidos = ["application/pdf", "image/png", "image/jpeg",];
    if (!tiposPermitidos.includes(factura.type)) {
      setFacturaSeleccionada(null);
      setMensaje("Selecciona un archivo PDF, PNG o JPG.");
      return;
    }
    if (factura.size > 10 * 1024 * 1024) {
      setFacturaSeleccionada(null);
      setMensaje("El archivo no puede superar los 10 MB.");
      return;
    }
    setFacturaSeleccionada(factura);
    setMensaje("");
    setProgreso(0);
  };

  const seleccionExploradorArchivos = (event: ChangeEvent<HTMLInputElement>) => {
    cargarFactura(event.target.files?.[0]);
    event.target.value = "";
  };

  const seleccionArrastre = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    cargarFactura(event.dataTransfer.files?.[0]);
  };

  const subirFactura = async () => {
    if (!facturaSeleccionada) {
      setMensaje("Primero selecciona una factura.");
      return;
    }
    setCargando(true);
    setProgreso(30);
    setMensaje("");

    try {
      await cargarFacturaApi(facturaSeleccionada);

      setProgreso(100);
      setMensaje("¡Factura procesada correctamente!");
      setFacturaSeleccionada(null);
    } catch (error) {
      setMensaje(
        error instanceof Error
          ? error.message
          : "Error al cargar la factura."
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          <header className="mb-4">
            <h1 className="h3 fw-bold">Cargar factura</h1>
            <p className="text-secondary">
              Selecciona una factura de servicios para procesarla.
            </p>
          </header>
          {mensaje && (
            <div className="alert alert-info" role="status">
              {mensaje}
              <button type="button" className="btn-close float-end" aria-label="Cerrar" onClick={() => setMensaje("")}/>
            </div>
          )}
          <section className="card shadow-sm">
            <div className="card-body p-4">
              <div className="carga-archivo text-center p-4 p-md-5" onDragOver={(event) => event.preventDefault()}onDrop={seleccionArrastre}>
                <div className="fs-1 text-primary mb-2">
                  <i className="bi bi-cloud-arrow-up" aria-hidden="true" />
                </div>
                <p className="fw-semibold mb-1">
                  Arrastra tu factura aquí
                </p>
                <p className="text-secondary small">
                  Archivos PDF, PNG o JPG · Máximo 10 MB
                </p>

                <input ref={inputArchivo} type="file" accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg" className="d-none"
                  onChange={seleccionExploradorArchivos}/>

                <button type="button" className="btn btn-outline-primary" disabled={cargando}
                  onClick={() => inputArchivo.current?.click()}>
                  Seleccionar archivo
                </button>

                {facturaSeleccionada && (
                  <div className="mt-4">
                    <p className="mb-2">
                      <strong>{facturaSeleccionada.name}</strong>
                    </p>

                    {facturaSeleccionada.type === "application/pdf" ? (
                      <p className="text-secondary small">
                        Archivo PDF seleccionado para procesar.
                      </p>
                    ) : (
                      <img src={URL.createObjectURL(facturaSeleccionada)} alt="Vista previa de la factura"
                        className="img-fluid rounded border"
                        style={{ maxHeight: 220 }}/>
                    )}

                    <div className="mt-3">
                      <button type="button" className="btn btn-primary" disabled={cargando} onClick={subirFactura}>
                        {cargando ? "Procesando..." : "Cargar factura"}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {(cargando || progreso > 0) && (
                <div className="progress mt-3" role="progressbar" aria-valuenow={progreso}aria-valuemin={0}aria-valuemax={100}>
                  <div className="progress-bar" style={{ width: `${progreso}%` }}>
                    {progreso}%
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default Factura;
