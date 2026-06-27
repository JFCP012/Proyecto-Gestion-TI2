package com.HenoTrade.ventaHeno.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.HenoTrade.ventaHeno.Entity.DetalleVenta;
import com.HenoTrade.ventaHeno.Entity.Factura;
import com.HenoTrade.ventaHeno.Entity.Heno;
import com.HenoTrade.ventaHeno.Entity.Vendedor;
import com.HenoTrade.ventaHeno.Repository.DetalleVentaRepositorio;
import com.HenoTrade.ventaHeno.Repository.FacturaRepositorio;
import com.HenoTrade.ventaHeno.Repository.HenoRepositorio;
import com.HenoTrade.ventaHeno.Repository.VendedorRepositorio;
import com.HenoTrade.ventaHeno.dto.CompraDTO;
import com.HenoTrade.ventaHeno.dto.DetalleVentaDTO;

@Service
public class FacturaServise {

    @Autowired
    private FacturaRepositorio facturaRepositorio;
    
    @Autowired
    private DetalleVentaRepositorio detalleVentaRepositorio;
    
    @Autowired
    private HenoRepositorio henoRepositorio;
    
    @Autowired
    private VendedorRepositorio vendedorRepositorio;

    public Factura guardarFactura(Factura factura) {
        return this.facturaRepositorio.save(factura);
    }
    
    @Transactional
    public Factura procesarCompra(CompraDTO compra) {
        Factura factura = compra.getFactura();
        
        // Asignar Vendedor (Asumiendo que viene el cedulaV en el objeto Factura)
        if (factura.getVendedor() != null && factura.getVendedor().getCedulaV() != null) {
            Vendedor vendedor = vendedorRepositorio.findById(factura.getVendedor().getCedulaV())
                .orElseThrow(() -> new RuntimeException("Vendedor no encontrado con cédula: " + factura.getVendedor().getCedulaV()));
            factura.setVendedor(vendedor);
        }
        
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
}
