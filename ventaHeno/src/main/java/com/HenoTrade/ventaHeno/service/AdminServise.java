package com.HenoTrade.ventaHeno.service;

import com.HenoTrade.ventaHeno.Repository.AdminRepositorio;
import org.springframework.stereotype.Service;

@Service
public class AdminServise {

    private final AdminRepositorio repositorio;

    public AdminServise(AdminRepositorio repositorio) {
        this.repositorio = repositorio;
    }

    public boolean loginAdmin(Long idAdmin, String clave) {
        return this.repositorio.findAll().stream()
                .anyMatch(admin -> admin.getIdAdmin().equals(idAdmin)
                        && admin.getClave().equals(clave));
    }
}
