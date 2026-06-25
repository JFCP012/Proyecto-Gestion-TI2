package com.HenoTrade.ventaHeno.service;

import com.HenoTrade.ventaHeno.Entity.Heno;
import com.HenoTrade.ventaHeno.Repository.HenoRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
public class HenoServise {

    private final HenoRepositorio repositorio;

    public HenoServise(HenoRepositorio repositorio) {
        this.repositorio = repositorio;
    }

    public Heno crearHeno(String henoJson, MultipartFile archivoImagen) throws IOException {
        // 1. Parsear el JSON del heno a un objeto de la entidad Heno
        ObjectMapper objectMapper = new ObjectMapper();
        Heno heno = objectMapper.readValue(henoJson, Heno.class);

        // 2. Crear la carpeta "uploads" si no existe
        Path directorioImagenes = Paths.get("uploads");
        if (!Files.exists(directorioImagenes)) {
            Files.createDirectories(directorioImagenes);
        }

        // 3. Generar un nombre único para la imagen para que no se sobreescriban
        String nombreArchivo = UUID.randomUUID().toString() + "_" + archivoImagen.getOriginalFilename();

        // 4. Guardar el archivo físicamente en la carpeta "uploads"
        Path rutaArchivo = directorioImagenes.resolve(nombreArchivo);
        Files.copy(archivoImagen.getInputStream(), rutaArchivo);

        // 5. Generar el link para acceder a la imagen
        // Asumiendo que tu backend corre en el puerto 8080 (cámbialo si usas otro)
        String linkImagen = "http://localhost:8080/images/" + nombreArchivo;

        // 6. Guardar el link en la entidad
        heno.setImagen(linkImagen);

        // 7. Guardar el heno en la base de datos
        return repositorio.save(heno);
    }

    public List<Heno> buscarHeno() {
        return this.repositorio.findAll();
    }

}
