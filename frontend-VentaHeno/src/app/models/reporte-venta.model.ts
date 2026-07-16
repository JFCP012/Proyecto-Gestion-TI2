/** Detalle de cada factura individual dentro del reporte */
export interface FacturaReporte {
  idFactura: number;
  fechaFactura: string;
  nombreCliente: string;
  cedulaCliente: string;
  totalVenta: number;
  envio: number;
  detalles: DetalleFacturaReporte[];
}

export interface DetalleFacturaReporte {
  tipoHeno: string;
  precioUnitario: number;
  cantidad: number;
  subtotal: number;
}

/** Respuesta completa del reporte mensual */
export interface ReporteVentaMensual {
  anio: number;
  mes: number;
  totalFacturas: number;
  montoTotal: number;
  facturas: FacturaReporte[];
}

export interface Animal {
  idAnimales: number;
  nombre: string;
}

/** Respuesta completa del reporte de facturas por animal */
export interface ReporteFacturasAnimal {
  idAnimal: number;
  nombreAnimal: string;
  totalFacturas: number;
  montoTotal: number;
  facturas: FacturaReporte[];
}

/** Respuesta completa del reporte de facturas por paca (heno) */
export interface ReporteFacturasHeno {
  nombreHeno: string;
  totalFacturas: number;
  montoTotal: number;
  facturas: FacturaReporte[];
}

export interface ReporteVentaCliente {
  cliente: {
    cedula: string;
    nombre: string;
    telefono: string;
    direccion?: string;
  } | null;
  totalFacturas: number;
  montoTotal: number;
  totalPacas: number;
  facturas: FacturaReporte[];
}
