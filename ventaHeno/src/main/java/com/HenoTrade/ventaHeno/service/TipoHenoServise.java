package com.HenoTrade.ventaHeno.service;

import java.util.Optional;
import org.springframework.stereotype.Service;
import com.HenoTrade.ventaHeno.Repository.HenoRepositorio;
import com.HenoTrade.ventaHeno.Entity.Animales;
import com.HenoTrade.ventaHeno.Entity.Heno;
import com.HenoTrade.ventaHeno.Entity.Tipo_Heno;
import com.HenoTrade.ventaHeno.Repository.TipoHenoRepositorio;
import com.HenoTrade.ventaHeno.Repository.AnimalRepositorio;

@Service
public class TipoHenoServise {

    private final TipoHenoRepositorio tipoHenoRepositorio;
    private final HenoRepositorio repositorioH;
    private final AnimalRepositorio animalRepositorio;

    public TipoHenoServise(TipoHenoRepositorio tipoHenoRepositorio, HenoRepositorio repositorioH,
            AnimalRepositorio animalRepositorio) {
        this.tipoHenoRepositorio = tipoHenoRepositorio;
        this.repositorioH = repositorioH;
        this.animalRepositorio = animalRepositorio;
    }

    public Tipo_Heno crearTipoHeno(Long idAnimal, Long idHeno) {
        Tipo_Heno tipoHeno = new Tipo_Heno();

        Optional<Animales> animal = this.animalRepositorio.findById(idAnimal);
        if (!animal.isPresent()) {
            throw new org.springframework.web.server.ResponseStatusException(
                org.springframework.http.HttpStatus.BAD_REQUEST, 
                "El animal con ID " + idAnimal + " no existe en la base de datos.");
        }
        tipoHeno.setAnimales(animal.get());

        Optional<Heno> heno2 = this.repositorioH.findById(idHeno);
        if (!heno2.isPresent()) {
            throw new org.springframework.web.server.ResponseStatusException(
                org.springframework.http.HttpStatus.BAD_REQUEST, 
                "El producto (heno) con ID " + idHeno + " no existe.");
        }
        tipoHeno.setHeno(heno2.get());

        return tipoHenoRepositorio.save(tipoHeno);
    }

}
