package com.HenoTrade.ventaHeno.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.HenoTrade.ventaHeno.Entity.DetalleVenta;
import com.HenoTrade.ventaHeno.Entity.Factura;
import com.HenoTrade.ventaHeno.Entity.Heno;
import com.HenoTrade.ventaHeno.Entity.Administrador;
import com.HenoTrade.ventaHeno.Repository.DetalleVentaRepositorio;
import com.HenoTrade.ventaHeno.Repository.FacturaRepositorio;
import com.HenoTrade.ventaHeno.Repository.HenoRepositorio;
import com.HenoTrade.ventaHeno.Repository.AdministradorRepositorio;
import com.HenoTrade.ventaHeno.dto.CompraDTO;
import com.HenoTrade.ventaHeno.dto.DetalleVentaDTO;
import com.HenoTrade.ventaHeno.dto.FacturaReporteDTO;
import com.HenoTrade.ventaHeno.dto.ReporteVentaMensualDTO;
import com.HenoTrade.ventaHeno.dto.ReporteFacturasHenoDTO;
import com.HenoTrade.ventaHeno.dto.ReporteVentaAnimalDTO;
import com.HenoTrade.ventaHeno.dto.ReporteFacturasAnimalDTO;
import com.HenoTrade.ventaHeno.dto.VentaAnimalDTO;

@Service
public class FacturaServise {

    @Autowired
    private FacturaRepositorio facturaRepositorio;
    
    @Autowired
    private DetalleVentaRepositorio detalleVentaRepositorio;
    
    @Autowired
    private HenoRepositorio henoRepositorio;
    
    @Autowired
    private AdministradorRepositorio administradorRepositorio;

    public Factura guardarFactura(Factura factura) {
        return this.facturaRepositorio.save(factura);
    }
    
    @Transactional
    public Factura procesarCompra(CompraDTO compra) {
        Factura factura = compra.getFactura();
        
        // Asignar Administrador (Asumiendo que viene el cedulaV en el objeto Factura)
        if (factura.getAdministrador() != null && factura.getAdministrador().getCedulaV() != null) {
            Administrador administrador = administradorRepositorio.findById(factura.getAdministrador().getCedulaV())
                .orElseThrow(() -> new RuntimeException("Administrador no encontrado con cédula: " + factura.getAdministrador().getCedulaV()));
            factura.setAdministrador(administrador);
        }
        
        // Asegurar que la fecha sea exactamente la de hoy en la zona horaria del servidor
        factura.setFechaFactura(java.sql.Date.valueOf(java.time.LocalDate.now()));
        
        // 1. Guardar factura
        Factura facturaGuardada = facturaRepositorio.save(factura);
        
        // 2. Procesar detalles (stock y guardar DetalleVenta)
        for (DetalleVentaDTO detalleDTO : compra.getDetalles()) {
            Heno heno = henoRepositorio.findById(detalleDTO.getIdHeno())
                .orElseThrow(() -> new RuntimeException("Heno no encontrado con ID: " + detalleDTO.getIdHeno()));
                
            if (heno.getStock() < detalleDTO.getCantidad()) {
                throw new RuntimeException("Stock insuficiente para el heno: " + heno.getNombre());
            }
            
            // Reducir stock
            heno.setStock(heno.getStock() - detalleDTO.getCantidad());
            
            // Eliminación lógica si el stock llega a 0
            if (heno.getStock() == 0) {
                heno.setEstado("Inactivo"); // Se cambia el estado en lugar de borrarlo físicamente para no romper el historial de facturas
                heno.setActivo(false);
            }
            
            henoRepositorio.save(heno);
            
            // Crear DetalleVenta
            DetalleVenta detalle = new DetalleVenta();
            detalle.setFactura(facturaGuardada);
            detalle.setHeno(heno);
            detalle.setCantidad(detalleDTO.getCantidad());
            
            detalleVentaRepositorio.save(detalle);
        }
        
        return facturaGuardada;
    }

    /**
     * Genera un reporte de ventas filtrado por mes y año.
     * Consulta todas las facturas del período y calcula los totales.
     */
    public ReporteVentaMensualDTO generarReportePorMes(int anio, int mes) {
        List<Factura> facturas = facturaRepositorio.findByAnioAndMes(anio, mes);

        List<FacturaReporteDTO> facturasDTO = facturas.stream()
            .map(f -> FacturaReporteDTO.builder()
                .idFactura(f.getIdFactura())
                .fechaFactura(f.getFechaFactura().toString())
                .nombreCliente(f.getNombreC())
                .cedulaCliente(f.getCedulaC())
                .totalVenta(f.getTotalVenta())
                .envio(f.getEnvio())
                .build())
            .collect(Collectors.toList());

        Double montoTotal = facturasDTO.stream()
            .mapToDouble(FacturaReporteDTO::getTotalVenta)
            .sum();

        return ReporteVentaMensualDTO.builder()
            .anio(anio)
            .mes(mes)
            .totalFacturas(facturasDTO.size())
            .montoTotal(montoTotal)
            .facturas(facturasDTO)
            .build();
    }

    /**
     * Genera un reporte de ventas detallado filtrado por el tipo de animal destino.
     */
    public ReporteFacturasAnimalDTO generarReportePorAnimal(Long idAnimal, String nombreAnimal) {
        List<Factura> facturas = facturaRepositorio.findFacturasPorAnimalId(idAnimal);

        List<FacturaReporteDTO> facturasDTO = facturas.stream()
            .map(f -> FacturaReporteDTO.builder()
                .idFactura(f.getIdFactura())
                .fechaFactura(f.getFechaFactura().toString())
                .nombreCliente(f.getNombreC())
                .cedulaCliente(f.getCedulaC())
                .totalVenta(f.getTotalVenta())
                .envio(f.getEnvio())
                .build())
            .collect(Collectors.toList());

        Double montoTotal = facturasDTO.stream()
            .mapToDouble(FacturaReporteDTO::getTotalVenta)
            .sum();

        return ReporteFacturasAnimalDTO.builder()
            .idAnimal(idAnimal)
            .nombreAnimal(nombreAnimal)
            .totalFacturas(facturasDTO.size())
            .montoTotal(montoTotal)
            .facturas(facturasDTO)
            .build();
    }
    
    /**
     * Genera un reporte de ventas detallado filtrado por el nombre del heno.
     */
    public ReporteFacturasHenoDTO generarReportePorHeno(String nombreHeno) {
        List<Factura> facturas = facturaRepositorio.findFacturasPorNombreHeno(nombreHeno);

        List<FacturaReporteDTO> facturasDTO = facturas.stream()
            .map(f -> FacturaReporteDTO.builder()
                .idFactura(f.getIdFactura())
                .fechaFactura(f.getFechaFactura().toString())
                .nombreCliente(f.getNombreC())
                .cedulaCliente(f.getCedulaC())
                .totalVenta(f.getTotalVenta())
                .envio(f.getEnvio())
                .build())
            .collect(Collectors.toList());

        Double montoTotal = facturasDTO.stream()
            .mapToDouble(FacturaReporteDTO::getTotalVenta)
            .sum();

        return ReporteFacturasHenoDTO.builder()
            .nombreHeno(nombreHeno)
            .totalFacturas(facturasDTO.size())
            .montoTotal(montoTotal)
            .facturas(facturasDTO)
            .build();
    }
}

