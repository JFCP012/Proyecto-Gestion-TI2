package com.HenoTrade.ventaHeno.service;

import org.springframework.beans.factory.annotation.Autowired;

import com.HenoTrade.ventaHeno.Entity.Factura;
import com.HenoTrade.ventaHeno.Repository.FacturaRepositorio;

public class FacturaServise {

    private FacturaRepositorio facturaRepositorio;

    public FacturaServise(FacturaRepositorio facturaRepositorio) {
        this.facturaRepositorio = facturaRepositorio;
    }

    public Factura guardarFactura(Factura factura) {
        return this.facturaRepositorio.save(factura);
    }

    public Factura obtenerFactura(Long id) {
        return this.facturaRepositorio.findById(id).orElse(null);
    }

    public Factura eliminarFactura(Long id) {
        this.facturaRepositorio.deleteById(id);
        return null;
    }

}
