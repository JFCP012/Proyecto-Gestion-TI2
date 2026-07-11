package com.HenoTrade.ventaHeno.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.HenoTrade.ventaHeno.Entity.Tipo_Heno;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.repository.query.Param;

@Repository
public interface TipoHenoRepositorio extends JpaRepository<Tipo_Heno, Long> {

    @Transactional
    @Modifying
    @Query("DELETE FROM Tipo_Heno t WHERE t.heno.idHeno = :idHeno")
    void deleteByHenoId(@Param("idHeno") Long idHeno);

    @Query("SELECT t.animales.idAnimales FROM Tipo_Heno t WHERE t.heno.idHeno = :idHeno")
    List<Long> findAnimalIdsByHenoId(@Param("idHeno") Long idHeno);

}
