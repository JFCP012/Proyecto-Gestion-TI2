/** Detalle de cada factura individual dentro del reporte */
export interface FacturaReporte {
  idFactura: number;
  fechaFactura: string;
  nombreCliente: string;
  cedulaCliente: string;
  totalVenta: number;
  envio: number;
}

/** Respuesta completa del reporte mensual */
export interface ReporteVentaMensual {
  anio: number;
  mes: number;
  totalFacturas: number;
  montoTotal: number;
  facturas: FacturaReporte[];
}
