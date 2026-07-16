package com.HenoTrade.ventaHeno.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.HenoTrade.ventaHeno.Entity.Factura;
import com.HenoTrade.ventaHeno.service.FacturaServise;
import com.HenoTrade.ventaHeno.dto.CompraDTO;

@RestController
@RequestMapping("/Factura")
@CrossOrigin(origins = {"http://localhost:4200", "${cors.allowed-origins:https://agroheno-f1tdbpbjz-jfcp012s-projects.vercel.app}"})
public class FacturaControlador {

    @Autowired
    private FacturaServise facturaServise;

    @PostMapping("/guardarFactura")
    public Factura guardarFactura(@RequestBody Factura factura) {
        return this.facturaServise.guardarFactura(factura);
    }
    
    @PostMapping("/procesarCompra")
    public Factura procesarCompra(@RequestBody CompraDTO compraDTO) {
        return this.facturaServise.procesarCompra(compraDTO);
    }
}
