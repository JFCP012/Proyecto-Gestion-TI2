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
public class ReporteFacturasAnimalDTO {
    private Long idAnimal;
    private String nombreAnimal;
    private int totalFacturas;
    private Double montoTotal;
    private List<FacturaReporteDTO> facturas;
}
