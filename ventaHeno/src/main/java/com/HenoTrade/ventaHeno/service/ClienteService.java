package com.HenoTrade.ventaHeno.service;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.HenoTrade.ventaHeno.Entity.Cliente;
import com.HenoTrade.ventaHeno.Repository.ClienteRepositorio;

@Service
public class ClienteService {

    @Autowired
    private Cloudinary cloudinary;

    @Autowired
    private ClienteRepositorio clienteRepositorio;

    public Cliente guardarCliente(String clienteJson, MultipartFile archivoImagen) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        Cliente cliente = objectMapper.readValue(clienteJson, Cliente.class);
        return guardarCliente(cliente, archivoImagen);
    }

    public Cliente guardarCliente(Cliente cliente, MultipartFile archivoImagen) {
        if (cliente.getCedula() == null || cliente.getCedula().trim().isEmpty()) {
            throw new IllegalArgumentException("La cédula del cliente es obligatoria.");
        }

        String cedulaTrimmed = cliente.getCedula().trim();
        Optional<Cliente> existente = clienteRepositorio.findByCedula(cedulaTrimmed);
        if (existente.isPresent()) {
            throw new IllegalArgumentException("Ya existe un cliente registrado con la cédula " + cedulaTrimmed + ".");
        }

        cliente.setCedula(cedulaTrimmed);

        if (archivoImagen != null && !archivoImagen.isEmpty()) {
            try {
                Map uploadResult = cloudinary.uploader().upload(archivoImagen.getBytes(), ObjectUtils.emptyMap());
                String linkImagen = (String) uploadResult.get("secure_url");
                cliente.setImagen(linkImagen);
            } catch (Exception e) {
                throw new RuntimeException("Error al subir la imagen del cliente a Cloudinary: " + e.getMessage(), e);
            }
        }
        return clienteRepositorio.save(cliente);
    }

    public Cliente guardarCliente(Cliente cliente) {
        Optional<Cliente> existente = clienteRepositorio.findByCedula(cliente.getCedula());
        if (existente.isPresent()) {
            Cliente c = existente.get();
            c.setNombre(cliente.getNombre());
            c.setTelefono(cliente.getTelefono());
            c.setDireccion(cliente.getDireccion());
            if (cliente.getClave() != null && !cliente.getClave().isEmpty()) {
                c.setClave(cliente.getClave());
            }
            if (cliente.getImagen() != null && !cliente.getImagen().isEmpty()) {
                c.setImagen(cliente.getImagen());
            }
            return clienteRepositorio.save(c);
        }
        return clienteRepositorio.save(cliente);
    }

    public Optional<Cliente> loginCliente(String cedula, String clave) {
        Optional<Cliente> opt = clienteRepositorio.findByCedula(cedula);
        if (opt.isPresent()) {
            Cliente c = opt.get();
            if (c.getClave() != null && c.getClave().equals(clave)) {
                return Optional.of(c);
            }
        }
        return Optional.empty();
    }

    public Optional<Cliente> buscarPorCedula(String cedula) {
        return clienteRepositorio.findByCedula(cedula);
    }

    public List<Cliente> buscarTodos() {
        return clienteRepositorio.findAll();
    }
}
