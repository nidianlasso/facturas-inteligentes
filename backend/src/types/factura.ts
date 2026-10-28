export interface Factura {
    numero_factura: number;
    fecha_emision: string;
    fecha_limite_pago: string;
    pago_total: number;
    numero_cliente: string;
    moneda: string;
    id_proveedor: number;  
}