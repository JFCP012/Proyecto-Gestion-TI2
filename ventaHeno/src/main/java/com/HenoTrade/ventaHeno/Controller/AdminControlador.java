package com.HenoTrade.ventaHeno.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.HenoTrade.ventaHeno.Entity.Admin;
import com.HenoTrade.ventaHeno.service.AdminServise;

@RestController
@RequestMapping("/Admin")
@CrossOrigin(origins = "http://localhost:4200")
public class AdminControlador {

    @Autowired
    private AdminServise adminServise;

    @GetMapping("/login")
    public boolean loginAdmin(@RequestParam Long idAdmin, @RequestParam String clave) {
        return this.adminServise.loginAdmin(idAdmin, clave);
    }
}
