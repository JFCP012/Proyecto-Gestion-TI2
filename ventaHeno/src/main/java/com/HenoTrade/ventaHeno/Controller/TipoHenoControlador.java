package com.HenoTrade.ventaHeno.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.HenoTrade.ventaHeno.Entity.Tipo_Heno;
import com.HenoTrade.ventaHeno.service.TipoHenoServise;

@RestController
@RequestMapping("/tipoHeno")
@CrossOrigin(origins = "*")
public class TipoHenoControlador {

    @Autowired
    private TipoHenoServise tipoHenoServise;

    @PostMapping("/crearTipoHeno")
    public Tipo_Heno crearTipoHeno(@RequestParam Long idAnimal, @RequestParam Long idHeno) {
        return this.tipoHenoServise.crearTipoHeno(idAnimal, idHeno);
    }

}
