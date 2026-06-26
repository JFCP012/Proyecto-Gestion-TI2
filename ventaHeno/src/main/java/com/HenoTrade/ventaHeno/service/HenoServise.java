package com.HenoTrade.ventaHeno.service;

import com.HenoTrade.ventaHeno.Entity.Heno;
import com.HenoTrade.ventaHeno.Repository.HenoRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class HenoServise {

    private final HenoRepositorio repositorio;
    private final TipoHenoServise tipoHenoServise;

    public HenoServise(HenoRepositorio repositorio, TipoHenoServise tipoHenoServise) {
        this.repositorio = repositorio;
        this.tipoHenoServise = tipoHenoServise;
    }

    @Autowired
    private org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    @jakarta.annotation.PostConstruct
    public void fixDatabaseSchema() {
        try {
            jdbcTemplate.execute("ALTER TABLE heno ALTER COLUMN descripcion DROP NOT NULL");
            System.out.println("==== FIX DB APLICADO: Columna 'descripcion' en tabla 'heno' ahora permite nulos ====");
        } catch(Exception e) {
            System.out.println("==== FIX DB INFO: " + e.getMessage() + " ====");
        }
    }

    public Heno crearHeno(String henoJson, MultipartFile archivoImagen, List<Long> idAnimales) throws IOException {
        // 1. Parsear el JSON del heno a un objeto de la entidad Heno
        ObjectMapper objectMapper = new ObjectMapper();
        Heno heno = objectMapper.readValue(henoJson, Heno.class);

        double precioU = heno.getPrecioU();
        double precioC = (precioU * heno.getStock());
        heno.setPrecioC(precioC);
        Long idHeno = heno.getIdHeno();

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
        Heno henoGuardado = repositorio.save(heno);

        // 8. Crear la relación con los animales si se proporcionaron
        if (idAnimales != null && !idAnimales.isEmpty()) {
            for (Long idAnimal : idAnimales) {
                tipoHenoServise.crearTipoHeno(idAnimal, henoGuardado.getIdHeno());
            }
        }

        return henoGuardado;
    }

    public List<Heno> buscarHeno() {
        return this.repositorio.findAll();
    }

    public Optional<Heno> buscarPorId(Long id) {
        return this.repositorio.findById(id);
    }

    public List<Heno> buscarPorTipo(String nombre) {
        return this.repositorio.buscarPorTipo(nombre);
    }

    public List<Heno> buscarPorNombre(String nombreHeno) {
        return this.repositorio.buscarPorNombre(nombreHeno);
    }

}
