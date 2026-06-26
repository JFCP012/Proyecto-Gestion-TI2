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

@RestController
@RequestMapping("/Factura")
@CrossOrigin(origins = "http://localhost:4200")
public class FacturaControlador {

    @Autowired
    private FacturaRepositorio facturaRepositorio;

    @PostMapping("/guardarFactura")
    public Factura guardarAnimal(@RequestBody Factura factura) {
        return this.facturaRepositorio.save(factura);
    }

}
