package com.HenoTrade.ventaHeno.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.HenoTrade.ventaHeno.Entity.Heno;
import org.springframework.data.jpa.repository.Query;

public interface HenoRepositorio extends JpaRepository<Heno, Long> {

    @Query("SELECT t.heno FROM Tipo_Heno t WHERE t.animales.nombre = :nombre")
    List<Heno> buscarPorTipo(String nombre);

    @Query("SELECT h FROM Heno h WHERE LOWER(h.nombre) LIKE LOWER(CONCAT('%', :nombreHeno, '%'))")
    List<Heno> buscarPorNombre(String nombreHeno);

}
