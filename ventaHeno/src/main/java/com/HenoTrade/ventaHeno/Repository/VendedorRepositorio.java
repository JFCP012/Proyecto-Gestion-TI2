package com.HenoTrade.ventaHeno.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.HenoTrade.ventaHeno.Entity.Vendedor;

public interface VendedorRepositorio extends JpaRepository<Vendedor, Long> {
}
