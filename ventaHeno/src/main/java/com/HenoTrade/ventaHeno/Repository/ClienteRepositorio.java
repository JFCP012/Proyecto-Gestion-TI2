package com.HenoTrade.ventaHeno.Repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.HenoTrade.ventaHeno.Entity.Cliente;

@Repository
public interface ClienteRepositorio extends JpaRepository<Cliente, String> {
    Optional<Cliente> findByCedula(String cedula);
}
