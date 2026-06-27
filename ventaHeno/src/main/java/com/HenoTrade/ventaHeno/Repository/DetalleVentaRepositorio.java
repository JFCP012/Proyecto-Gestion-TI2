package com.HenoTrade.ventaHeno.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.HenoTrade.ventaHeno.Entity.DetalleVenta;

public interface DetalleVentaRepositorio extends JpaRepository<DetalleVenta, Long> {
}
