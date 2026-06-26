package com.HenoTrade.ventaHeno.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.HenoTrade.ventaHeno.Entity.Factura;

@Repository
public interface FacturaRepositorio extends JpaRepository<Factura, Long> {

}
