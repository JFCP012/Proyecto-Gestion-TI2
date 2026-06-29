package com.HenoTrade.ventaHeno.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.HenoTrade.ventaHeno.Repository.AnimalRepositorio;

import com.HenoTrade.ventaHeno.Entity.Animales;

@RestController
@RequestMapping("/animal")
@CrossOrigin(origins = "http://localhost:4200")
public class AnimalControlaor {

    @Autowired
    private AnimalRepositorio animalRepositorio;

    @GetMapping("/buscarAnimalPorId")
    public Animales buscarAnimalPorId(@RequestParam Long id) {
        return this.animalRepositorio.findById(id).get();
    }

    @GetMapping("/todos")
    public java.util.List<Animales> obtenerTodos() {
        return this.animalRepositorio.findAll();
    }

    @PostMapping("/guardar")
    public Animales guardarAnimal(@RequestBody Animales animal) {
        return this.animalRepositorio.save(animal);
    }

}
