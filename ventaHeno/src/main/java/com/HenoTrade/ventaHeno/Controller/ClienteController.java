package com.HenoTrade.ventaHeno.Controller;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.HenoTrade.ventaHeno.Entity.Cliente;
import com.HenoTrade.ventaHeno.service.ClienteService;

@RestController
@RequestMapping("/Cliente")
public class ClienteController {

    @Autowired
    private ClienteService clienteService;

    @PostMapping("/registrar")
    public ResponseEntity<?> registrar(
            @RequestParam("cliente") String clienteJson,
            @RequestParam(value = "imagen", required = false) MultipartFile imagen) {
        try {
            Cliente guardado = clienteService.guardarCliente(clienteJson, imagen);
            return ResponseEntity.ok(guardado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", "Error al registrar el cliente: " + e.getMessage()));
        }
    }

    @GetMapping("/buscarPorCedula")
    public ResponseEntity<Cliente> buscarPorCedula(@RequestParam String cedula) {
        Optional<Cliente> cliente = clienteService.buscarPorCedula(cedula);
        if (cliente.isPresent()) {
            return ResponseEntity.ok(cliente.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/listarTodos")
    public ResponseEntity<List<Cliente>> listarTodos() {
        return ResponseEntity.ok(clienteService.buscarTodos());
    }

    @PostMapping("/login")
    public ResponseEntity<Cliente> login(@RequestBody java.util.Map<String, String> body) {
        String cedula = body.get("cedula");
        String clave = body.get("clave");
        Optional<Cliente> resultado = clienteService.loginCliente(cedula, clave);
        if (resultado.isPresent()) {
            return ResponseEntity.ok(resultado.get());
        } else {
            return ResponseEntity.status(401).body(null);
        }
    }
    // fthyt
    // fhjddhjd
}
