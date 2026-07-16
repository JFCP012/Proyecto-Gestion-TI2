package com.HenoTrade.ventaHeno.dto;

import java.util.List;
import com.HenoTrade.ventaHeno.Entity.Cliente;
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
public class ReporteVentaClienteDTO {
    private Cliente cliente;
    private int totalFacturas;
    private Double montoTotal;
    private int totalPacas;
    private List<FacturaReporteDTO> facturas;
}
