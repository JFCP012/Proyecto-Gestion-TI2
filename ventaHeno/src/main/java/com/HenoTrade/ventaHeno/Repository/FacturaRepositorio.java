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

    @Query("SELECT DISTINCT f FROM Factura f JOIN DetalleVenta dv ON f.idFactura = dv.factura.idFactura " +
           "JOIN dv.heno h JOIN Tipo_Heno th ON h.idHeno = th.heno.idHeno " +
           "WHERE th.animales.idAnimales = :idAnimal")
    List<Factura> findFacturasPorAnimalId(@Param("idAnimal") Long idAnimal);

    @Query("SELECT DISTINCT f FROM Factura f JOIN DetalleVenta dv ON f.idFactura = dv.factura.idFactura " +
           "JOIN dv.heno h WHERE LOWER(h.nombre) LIKE LOWER(CONCAT('%', :nombreHeno, '%'))")
    List<Factura> findFacturasPorNombreHeno(@Param("nombreHeno") String nombreHeno);

    @Query("SELECT f FROM Factura f WHERE f.cedulaC = :cedula")
    List<Factura> findByCedulaC(@Param("cedula") String cedula);
}
