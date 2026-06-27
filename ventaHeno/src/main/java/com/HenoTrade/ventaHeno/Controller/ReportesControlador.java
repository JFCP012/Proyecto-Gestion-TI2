package com.HenoTrade.ventaHeno.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.HenoTrade.ventaHeno.dto.ReporteVentaMensualDTO;
import com.HenoTrade.ventaHeno.service.FacturaServise;

@RestController
@RequestMapping("/Reportes")
@CrossOrigin(origins = "http://localhost:4200")
public class ReportesControlador {

    @Autowired
    private FacturaServise facturaServise;

    @GetMapping("/ventasPorMes")
    public ReporteVentaMensualDTO ventasPorMes(@RequestParam int anio, @RequestParam int mes) {
        return facturaServise.generarReportePorMes(anio, mes);
    }
}
