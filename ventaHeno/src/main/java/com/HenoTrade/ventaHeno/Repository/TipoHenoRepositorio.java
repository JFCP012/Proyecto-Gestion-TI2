package com.HenoTrade.ventaHeno.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.HenoTrade.ventaHeno.Entity.Tipo_Heno;

@Repository
public interface TipoHenoRepositorio extends JpaRepository<Tipo_Heno, Long> {

}
