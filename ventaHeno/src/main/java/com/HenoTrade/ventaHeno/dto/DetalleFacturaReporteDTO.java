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
public class DetalleFacturaReporteDTO {
    private String tipoHeno;
    private Double precioUnitario;
    private Integer cantidad;
    private Double subtotal;
}
