package com.HenoTrade.ventaHeno.dto;

import java.util.List;
import com.HenoTrade.ventaHeno.Entity.Factura;
import lombok.Data;

@Data
public class CompraDTO {
    private Factura factura;
    private List<DetalleVentaDTO> detalles;
}
