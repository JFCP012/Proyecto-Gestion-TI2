package com.HenoTrade.ventaHeno.service;

import com.HenoTrade.ventaHeno.Repository.AdministradorRepositorio;
import org.springframework.stereotype.Service;

@Service
public class AdminServise {

    private final AdministradorRepositorio repositorio;

    public AdminServise(AdministradorRepositorio repositorio) {
        this.repositorio = repositorio;
    }

    public boolean loginAdmin(Long cedulaV, String clave) {
        return this.repositorio.findAll().stream()
                .anyMatch(admin -> admin.getCedulaV().equals(cedulaV)
                        && admin.getClave().equals(clave));
    }
}
