package com.HenoTrade.ventaHeno.service;

import com.HenoTrade.ventaHeno.Entity.Animales;
import com.HenoTrade.ventaHeno.Repository.AnimalRepositorio;

public class AnimalService {

    private final AnimalRepositorio animalRepositorio;

    public AnimalService(AnimalRepositorio animalRepositorio) {
        this.animalRepositorio = animalRepositorio;
    }

    public Animales buscarAnimalPorId(Long id) {
        return this.animalRepositorio.findById(id).get();
    }

    public Animales guardarAnimal(Animales animal) {
        return this.animalRepositorio.save(animal);
    }

}
