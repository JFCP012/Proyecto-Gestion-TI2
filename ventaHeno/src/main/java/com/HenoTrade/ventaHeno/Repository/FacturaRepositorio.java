package com.HenoTrade.ventaHeno.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.HenoTrade.ventaHeno.Entity.Factura;

@Repository
public interface FacturaRepositorio extends JpaRepository<Factura, Long> {

    @Query("SELECT f FROM Factura f WHERE YEAR(f.fechaFactura) = :anio AND MONTH(f.fechaFactura) = :mes")
    List<Factura> findByAnioAndMes(@Param("anio") int anio, @Param("mes") int mes);

}
