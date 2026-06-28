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
public class ReporteVentaAnimalDTO {
    private int anio;
    private int mes;
    private Double montoTotal;
    private List<VentaAnimalDTO> animales;
}
