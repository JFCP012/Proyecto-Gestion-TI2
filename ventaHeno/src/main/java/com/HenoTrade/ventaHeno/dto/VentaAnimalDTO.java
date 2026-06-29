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
public class VentaAnimalDTO {
    private String nombreAnimal;
    private Long cantidadVendida;
    private Double montoTotal;
}
