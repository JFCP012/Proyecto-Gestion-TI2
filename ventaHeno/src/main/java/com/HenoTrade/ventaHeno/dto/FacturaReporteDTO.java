package com.HenoTrade.ventaHeno.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FacturaReporteDTO {

    private Long idFactura;
    private String fechaFactura;
    private String nombreCliente;
    private String cedulaCliente;
    private Double totalVenta;
    private Double envio;
    private java.util.List<DetalleFacturaReporteDTO> detalles;
}
