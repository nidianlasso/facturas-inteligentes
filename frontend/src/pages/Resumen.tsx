import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { resumenFacturasApi, type ResumenFactura} from "../services/FacturasApi";

function Resumen() {
    const [resumen, setResumen] = useState<ResumenFactura[]>([]);
     const [cargando, setCargando] = useState(true);
     const [error, setError] = useState("");
     const navigate = useNavigate();
    useEffect (() =>{
        const cargarResumen = async () => {
            try {
                const resultado = await resumenFacturasApi();
                setResumen(resultado.resumen);
                console.log(resultado.resumen);

            } catch (error) {
                setError(
            error instanceof Error
                ? error.message
                : "Error al cargar el resumen."
            );
            }finally{
                setCargando(false);
            }
        };
        cargarResumen();
    }, [])
  return (
    <main className="container py-5">
        <button type="button" className="btn btn-outline-primary" onClick={() => {navigate(`/`)}} style={{marginRight:20}}>Volver</button>
      <h1>Resumen de Facturas</h1>
      <section>
        
        <div className="card shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Proveedor</th>
                  <th>Periodo</th>
                  <th>Moneda</th>
                  <th>Cantidad Facturas</th>
                  <th className="text-end">Total Facturado</th>
                </tr>
              </thead>
              <tbody>
                {cargando ? (
                    <tr>
                        <td colSpan={8} className="text-center py-4">
                        Cargando...
                        </td>
                    </tr>
                ) : error ? (
                    <tr>
                        <td colSpan={8} className="text-center text-danger py-4">
                        {error}
                        </td>
                  </tr>
                ): resumen.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-4">
                     "No se encontró ninguna factura con ese ID." : "No hay facturas registradas."
                    </td>
                  </tr>
                ):( resumen.map((item) => (
                    <tr key={item.proveedor}>
                        <td>{item.proveedor}</td>
                        <td>{item.periodo}</td>
                        <td>{item.moneda}</td>
                        <td>{item.cantidad_facturas}</td>
                        <td>{item.total_facturado !== null
                          ? new Intl.NumberFormat("es-CO", {
                          style: "currency",
                          currency: item.moneda || "COP",
                          }).format(item.total_facturado)
                          : "—"
                        }</td>
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

export default Resumen;
