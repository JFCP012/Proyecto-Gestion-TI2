package com.HenoTrade.ventaHeno.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.HenoTrade.ventaHeno.Entity.Administrador;
import com.HenoTrade.ventaHeno.service.AdminServise;

@RestController
@RequestMapping("/Admin")
@CrossOrigin(origins = {"http://localhost:4200", "${cors.allowed-origins:https://agroheno-f1tdbpbjz-jfcp012s-projects.vercel.app}"})
public class AdminControlador {

    @Autowired
    private AdminServise adminServise;

    @GetMapping("/login")
    public boolean loginAdmin(@RequestParam Long cedulaV, @RequestParam String clave) {
        return this.adminServise.loginAdmin(cedulaV, clave);
    }
}
