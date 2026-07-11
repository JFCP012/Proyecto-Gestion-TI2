package com.HenoTrade.ventaHeno.Controller;

import com.HenoTrade.ventaHeno.Entity.Heno;
import com.HenoTrade.ventaHeno.service.HenoServise;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Optional;
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
            @RequestParam("heno") String henoJson,
            @RequestParam("imagen") MultipartFile archivoImagen,
            @RequestParam(value = "idAnimales", required = false) List<Long> idAnimales) {

        try {
            Heno henoGuardado = henoServise.crearHeno(henoJson, archivoImagen, idAnimales);
            return ResponseEntity.ok(henoGuardado);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Error al procesar la peticion: " + e.getMessage());
        }
    }

    @GetMapping("buscar")
    public List<Heno> buscarHeno() {
        return this.henoServise.buscarHeno();
    }

    @GetMapping("buscarPorId")
    public ResponseEntity<Heno> buscarPorId(@RequestParam Long id) {
        Optional<Heno> heno = this.henoServise.buscarPorId(id);
        if (heno.isPresent()) {
            return ResponseEntity.ok(heno.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("buscarPorTipo")
    public List<Heno> buscarPorTipo(@RequestParam String nombre) {
        return this.henoServise.buscarPorTipo(nombre);
    }

    @GetMapping("buscarPorNombre")
    public List<Heno> buscarPorNombre(@RequestParam String nombreHeno) {
        return this.henoServise.buscarPorNombre(nombreHeno);
    }

    @GetMapping("buscarTodos")
    public List<Heno> buscarTodos() {
        return this.henoServise.buscarTodos();
    }

    @GetMapping("buscarAnimales")
    public List<Long> buscarAnimales(@RequestParam Long idHeno) {
        return this.henoServise.buscarAnimalIds(idHeno);
    }

    @PutMapping("cambiarEstado/{id}")
    public ResponseEntity<?> cambiarEstado(@PathVariable Long id, @RequestParam("activo") Boolean activo) {
        try {
            Heno henoActualizado = this.henoServise.cambiarEstado(id, activo);
            return ResponseEntity.ok(henoActualizado);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error al cambiar el estado: " + e.getMessage());
        }
    }

    @PutMapping("editar/{id}")
    public ResponseEntity<?> editarHeno(
            @PathVariable Long id,
            @RequestParam("heno") String henoJson,
            @RequestParam(value = "imagen", required = false) MultipartFile archivoImagen,
            @RequestParam(value = "idAnimales", required = false) List<Long> idAnimales) {

        try {
            Heno henoEditado = henoServise.editarHeno(id, henoJson, archivoImagen, idAnimales);
            return ResponseEntity.ok(henoEditado);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Error al procesar la peticion de edicion: " + e.getMessage());
        }
    }

}
