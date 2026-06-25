package com.HenoTrade.ventaHeno.Controller;

import com.HenoTrade.ventaHeno.Entity.Heno;
import com.HenoTrade.ventaHeno.service.HenoServise;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/Heno")
@CrossOrigin(origins = "http://localhost:4200")
public class HenoControlador {

    @Autowired
    private HenoServise henoServise;

    @PostMapping("/crear")
    public ResponseEntity<?> crearHeno(
            @RequestPart("heno") String henoJson,
            @RequestPart("archivoImagen") MultipartFile archivoImagen) {

        try {
            Heno henoGuardado = henoServise.crearHeno(henoJson, archivoImagen);
            return ResponseEntity.ok(henoGuardado);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Error al procesar la peticion: " + e.getMessage());
        }
    }

    @GetMapping("buscar")
    public List<Heno> buscarHeno() {
        return this.henoServise.buscarHeno();
    }

}
