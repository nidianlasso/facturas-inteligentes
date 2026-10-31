import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { buscarFacturaPorIdApi, type Factura as TipoFactura} from "../services/FacturasApi";
import { useForm, type SubmitHandler } from "react-hook-form";



function EditarFactura() {
    const { register, handleSubmit, reset, formState: { errors }} = useForm<TipoFactura>();
    const [mensaje, setMensaje] = useState("");
    const [errorFacturas, setErrorFacturas] = useState("");
    const [cargandoFacturas, setCargandoFacturas] = useState(false);
    const { id } = useParams();

//   console.log("ID recibido al editar:", id);

  useEffect(() => {
    
    obtenerFactura();
    
  }, [id]);

  const obtenerFactura = async () => {
      const idLlegada = Number(id);
      console.log("id");
      console.log(idLlegada);
      
      if (!Number.isInteger(idLlegada) || idLlegada <= 0) {
        console.log("entrada a if");
        setErrorFacturas("Ingresa un ID válido.");
        return;
      }
      try {
        console.log("entrada a try");
        setCargandoFacturas(true);
        setErrorFacturas("");
        const facturaRecibida = await buscarFacturaPorIdApi(idLlegada);
        reset(facturaRecibida);
        console.log("información llegada");        
      } catch (error) {        
        setMensaje(
            error instanceof Error
            ? error.message
            : "Error al cargar la factura."
        );
      } finally {
        setCargandoFacturas(false);
      }
    };
    const onSubmit: SubmitHandler<TipoFactura> = (data) => {
      console.log("Datos del formulario enviados:", data);
    };
  return (
     <div className="form-container"> 
      <form className="formulario" onSubmit={handleSubmit(onSubmit)}>
        <h2>Editar Factura</h2>
        <br></br>
        <div className="form-group">
          <label htmlFor="numero_factura">Número de factura</label>
          <input type="text"  {...register("numero_factura", { required: "El número de factura es obligatorio" })}/>
            {errors.numero_factura && <p style={{ color: "red" }}>{errors.numero_factura.message}</p>}
     </div>

        <div className="form-group">
          <label htmlFor="fecha_emision">Fecha de emisión</label>
          <input type="date" {...register("fecha_emision", { required: "la fecha de emisión es obligatoria" })} 
          />
          {errors.fecha_emision && <p style={{ color: "red" }}>{errors.fecha_emision.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="fecha_limite_pago">Fecha límite de pago</label>
          <input type="date" {...register("fecha_limite_pago", { required: "la fecha de vencimiento es obligatoria" })}
          />
          {errors.fecha_limite_pago && <p style={{ color: "red" }}>{errors.fecha_limite_pago.message}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="pago_total">Total a pagar</label>
          <input type="number" {...register("pago_total", {valueAsNumber: true })}
          />
          {errors.pago_total && <p style={{ color: "red" }}>{errors.pago_total.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="moneda">Moneda</label>
          <input type="text"  {...register("moneda", { required: "El tipo moneda es obligatorio" })}/>
            {errors.moneda && <p style={{ color: "red" }}>{errors.moneda.message}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="numero_cliente">Número de cliente</label>
          <input type="text" {...register("numero_cliente", { required: "El número del cliente es obligatorio" })}/>
          {errors.numero_cliente && <p style={{ color: "red" }}>{errors.numero_cliente.message}</p>}
        </div>
          <div className="form-group">
          <label htmlFor="proveedor">Proveedor</label>
          <input type="text" {...register("proveedor", { required: "El proveedor es obligatorio" })}/>
           {errors.proveedor && <p style={{ color: "red" }}>{errors.proveedor.message}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="nit">Nit</label>
          <input type="text" {...register("nit", { required: "El nit es obligatorio" })}/>
          {errors.nit && <p style={{ color: "red" }}>{errors.nit.message}</p>}
        </div>
        <button type="submit" className="btn-enviar" >
          Actualizar
        </button>
      </form>
      
    </div>
  );
}

export default EditarFactura;