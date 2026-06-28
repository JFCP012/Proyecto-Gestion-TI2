package com.HenoTrade.ventaHeno.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import com.HenoTrade.ventaHeno.Entity.DetalleVenta;
import com.HenoTrade.ventaHeno.dto.VentaAnimalDTO;

public interface DetalleVentaRepositorio extends JpaRepository<DetalleVenta, Long> {

    @Query("SELECT new com.HenoTrade.ventaHeno.dto.VentaAnimalDTO(a.nombre, SUM(CAST(dv.cantidad AS long)), SUM(dv.cantidad * h.precioU)) " +
           "FROM DetalleVenta dv " +
           "JOIN dv.factura f " +
           "JOIN dv.heno h " +
           "JOIN Tipo_Heno th ON th.heno.idHeno = h.idHeno " +
           "JOIN th.animales a " +
           "WHERE YEAR(f.fechaFactura) = :anio AND MONTH(f.fechaFactura) = :mes " +
           "GROUP BY a.nombre")
    List<VentaAnimalDTO> findVentasPorAnimal(@Param("anio") int anio, @Param("mes") int mes);
}
