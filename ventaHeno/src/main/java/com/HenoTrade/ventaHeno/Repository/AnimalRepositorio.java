package com.HenoTrade.ventaHeno.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;

import com.HenoTrade.ventaHeno.Entity.Animales;

@Repository
public interface AnimalRepositorio extends JpaRepository<Animales, Long> {

    @Query("SELECT a.idAnimales FROM Animales a WHERE LOWER(a.nombre) LIKE LOWER(CONCAT('%', :nombreAnimal, '%'))")
    List<Long> buscarPorNombre(String nombreAnimal);
}
