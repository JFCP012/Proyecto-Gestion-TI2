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
import com.HenoTrade.ventaHeno.Entity.Cliente;
import com.HenoTrade.ventaHeno.service.ClienteService;

@RestController
@RequestMapping("/Cliente")
@CrossOrigin(origins = "*")
public class ClienteController {

    @Autowired
    private ClienteService clienteService;

    @PostMapping("/registrar")
    public ResponseEntity<Cliente> registrar(@RequestBody Cliente cliente) {
        Cliente guardado = clienteService.guardarCliente(cliente);
        return ResponseEntity.ok(guardado);
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
}
