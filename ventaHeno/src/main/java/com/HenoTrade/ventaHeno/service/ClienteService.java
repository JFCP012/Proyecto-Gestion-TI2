package com.HenoTrade.ventaHeno.service;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.HenoTrade.ventaHeno.Entity.Cliente;
import com.HenoTrade.ventaHeno.Repository.ClienteRepositorio;

@Service
public class ClienteService {

    @Autowired
    private ClienteRepositorio clienteRepositorio;

    public Cliente guardarCliente(Cliente cliente) {
        Optional<Cliente> existente = clienteRepositorio.findByCedula(cliente.getCedula());
        if (existente.isPresent()) {
            Cliente c = existente.get();
            c.setNombre(cliente.getNombre());
            c.setTelefono(cliente.getTelefono());
            c.setDireccion(cliente.getDireccion());
            return clienteRepositorio.save(c);
        }
        return clienteRepositorio.save(cliente);
    }

    public Optional<Cliente> buscarPorCedula(String cedula) {
        return clienteRepositorio.findByCedula(cedula);
    }

    public List<Cliente> buscarTodos() {
        return clienteRepositorio.findAll();
    }
}
