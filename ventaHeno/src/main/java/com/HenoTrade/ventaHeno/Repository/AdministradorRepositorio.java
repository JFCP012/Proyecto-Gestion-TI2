package com.HenoTrade.ventaHeno.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.HenoTrade.ventaHeno.Entity.Administrador;

@Repository
public interface AdministradorRepositorio extends JpaRepository<Administrador, Long> {
}
