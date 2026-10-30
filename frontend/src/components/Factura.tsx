
import { useRef, useState, useEffect } from "react";
import type { ChangeEvent, DragEvent } from "react";
import { cargarFacturaApi,  listaFacturasApi, buscarFacturaPorIdApi, type Factura } from "../services/FacturasApi";



function Factura() {
  const [facturaSeleccionada, setFacturaSeleccionada] = useState<File | null>(null);
  const [progreso, setProgreso] = useState(0);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const inputArchivo = useRef<HTMLInputElement>(null);
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [cargandoFacturas, setCargandoFacturas] = useState(false);
  const [errorFacturas, setErrorFacturas] = useState("");
  const [idBusqueda, setIdBusqueda] = useState("");

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
      await obtenerFacturas();

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
  const obtenerFacturas = async () => {
    try {
      setCargandoFacturas(true);
      setErrorFacturas("");

      const resultado = await listaFacturasApi();

      setFacturas(resultado.facturas);

    } catch (error) {
      setErrorFacturas(
        error instanceof Error
          ? error.message
          : "Error al consultar las facturas."
      );
    } finally {
      setCargandoFacturas(false);
    }
  };
  useEffect(() => {
    obtenerFacturas();
  }, []);
  const buscarFactura = async () => {
    const id = Number(idBusqueda);

    if (!idBusqueda.trim()) {
      setErrorFacturas("Ingresa el ID de la factura que deseas buscar.");
      return;
    }
    if (!Number.isInteger(id) || id <= 0) {
      setErrorFacturas("Ingresa un ID válido.");
      return;
    }
    try {
      setCargandoFacturas(true);
      setErrorFacturas("");
      const facturaConsultada = await buscarFacturaPorIdApi(id);
      setFacturas([facturaConsultada]);
    } catch (error) {
      setFacturas([]);

      setErrorFacturas(
        error instanceof Error
          ? error.message
          : "Error al buscar la factura."
      );
    } finally {
      setCargandoFacturas(false);
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
      
      <section className="mt-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h5 fw-bold mb-0">Facturas registradas</h2>
        </div>
        <div className="row mb-3">
          <div className="col-12 col-md-6 col-lg-5">
            <div className="input-group">
              <input id="buscarFactura" type="number" min="1" className="form-control"
                placeholder="Buscar factura por id" value={idBusqueda}
                onChange={(e) => setIdBusqueda(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    buscarFactura();
                  }
                }}/>
              <button type="button" className="btn btn-primary" onClick={buscarFactura}
                disabled={cargandoFacturas}>
                <i className="bi bi-search me-1"></i>
                Buscar
              </button>
            </div>
        </div>
        </div>
        <div className="card shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Número</th>
                  <th>Proveedor</th>
                  <th>Emisión</th>
                  <th>Vencimiento</th>
                  <th className="text-end">Valor</th>
                  <th>Documento</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {cargandoFacturas ? (
                  <tr>
                    <td colSpan={8} className="text-center py-4">
                      Cargando facturas...
                    </td>
                  </tr>
                ) : errorFacturas ? (
                  <tr>
                    <td colSpan={8} className="text-center text-danger py-4">
                      {errorFacturas}
                    </td>
                  </tr>
                ) : facturas.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-4">
                    {idBusqueda.trim() ? "No se encontró ninguna factura con ese ID." : "No hay facturas registradas."}
                    </td>
                  </tr>
                ) : (
                  facturas.map((factura) => (
                    <tr key={factura.id_factura}>
                      <td>{factura.id_factura}</td>
                      <td>{factura.numero_factura || "—"}</td>
                      <td>{factura.proveedor}</td>
                      <td>{factura.fecha_emision || "—"}</td>
                      <td>{factura.fecha_limite_pago || "—"}</td>
                      <td className="text-end">
                        {factura.pago_total !== null
                          ? new Intl.NumberFormat("es-CO", {
                          style: "currency",
                          currency: factura.moneda || "COP",
                          }).format(factura.pago_total)
                          : "—"
                        }
                      </td>
                      <td>{factura.documento || "—"}</td>
                      <td>
                        <div className="d-flex justify-content-center gap-2">
                          <button type="button" className="btn btn-sm btn-outline-primary" title="Previsualizar factura">
                            👁️
                          </button>
                          <button type="button" className="btn btn-sm btn-outline-warning" title="Editar factura">
                            ✏️
                          </button>
                          <button type="button" className="btn btn-sm btn-outline-danger" title="Eliminar factura">
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Factura;
