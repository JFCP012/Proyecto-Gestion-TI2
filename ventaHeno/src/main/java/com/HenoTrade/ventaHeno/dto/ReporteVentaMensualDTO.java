package com.HenoTrade.ventaHeno.dto;

import java.util.List;

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
public class ReporteVentaMensualDTO {

    private int anio;
    private int mes;
    private int totalFacturas;
    private Double montoTotal;
    private List<FacturaReporteDTO> facturas;
}
