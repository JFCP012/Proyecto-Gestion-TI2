package com.HenoTrade.ventaHeno.service;

import com.HenoTrade.ventaHeno.Entity.Heno;
import com.HenoTrade.ventaHeno.Repository.HenoRepositorio;
import com.HenoTrade.ventaHeno.Repository.TipoHenoRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

@Service
public class HenoServise {

    private final HenoRepositorio repositorio;
    private final TipoHenoServise tipoHenoServise;
    private final TipoHenoRepositorio tipoHenoRepositorio;

    @Autowired
    private Cloudinary cloudinary;

    public HenoServise(HenoRepositorio repositorio, TipoHenoServise tipoHenoServise, TipoHenoRepositorio tipoHenoRepositorio) {
        this.repositorio = repositorio;
        this.tipoHenoServise = tipoHenoServise;
        this.tipoHenoRepositorio = tipoHenoRepositorio;
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

        try {
            jdbcTemplate.execute("UPDATE heno SET activo = true WHERE activo IS NULL");
            System.out.println("==== FIX DB APLICADO: Columna 'activo' inicializada a true para nulos ====");
        } catch(Exception e) {
            System.out.println("==== FIX DB ACTIVO INFO: " + e.getMessage() + " ====");
        }

        try {
            Integer count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM animales", Integer.class);
            if (count == null || count == 0) {
                jdbcTemplate.execute("INSERT INTO animales (id_animales, nombre) VALUES (1, 'Bovinos'), (2, 'Equinos'), (3, 'Ovinos')");
                try {
                    jdbcTemplate.execute("SELECT setval(pg_get_serial_sequence('animales', 'id_animales'), 3)");
                } catch(Exception seqEx) {
                    System.out.println("==== SEED SEQUENCE INFO: " + seqEx.getMessage() + " ====");
                }
                System.out.println("==== SEED APLICADO: Animales (Bovinos, Equinos, Ovinos) creados con éxito ====");
            }
        } catch(Exception e) {
            System.out.println("==== SEED ERR: " + e.getMessage() + " ====");
        }
    }

    public Heno crearHeno(String henoJson, MultipartFile archivoImagen, List<Long> idAnimales) throws IOException {
        // 1. Parsear el JSON del heno a un objeto de la entidad Heno
        ObjectMapper objectMapper = new ObjectMapper();
        Heno heno = objectMapper.readValue(henoJson, Heno.class);

        double precioU = heno.getPrecioU();
        double precioC = (precioU * heno.getStock());
        heno.setPrecioC(precioC);
        
        // Asignar activo basado en el stock
        if (heno.getStock() != null && heno.getStock() > 0) {
            heno.setActivo(true);
        } else {
            heno.setActivo(false);
        }

        // 2. Subir el archivo a Cloudinary
        Map uploadResult = cloudinary.uploader().upload(archivoImagen.getBytes(), ObjectUtils.emptyMap());

        // 3. Obtener el link seguro
        String linkImagen = (String) uploadResult.get("secure_url");

        // 4. Guardar el link en la entidad
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
        return this.repositorio.findByActivoTrue();
    }

    public List<Heno> buscarTodos() {
        return this.repositorio.findAll();
    }

    public List<Long> buscarAnimalIds(Long idHeno) {
        return this.tipoHenoRepositorio.findAnimalIdsByHenoId(idHeno);
    }

    public Heno cambiarEstado(Long id, Boolean activo) {
        Heno heno = repositorio.findById(id)
                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(
                        org.springframework.http.HttpStatus.NOT_FOUND, "Heno no encontrado"));
        heno.setActivo(activo);
        if (!activo) {
            heno.setStock(0);
            heno.setPrecioC(0.0);
        }
        return repositorio.save(heno);
    }

    public Heno editarHeno(Long id, String henoJson, MultipartFile archivoImagen, List<Long> idAnimales) throws IOException {
        Heno henoExistente = repositorio.findById(id)
                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(
                        org.springframework.http.HttpStatus.NOT_FOUND, "Heno no encontrado"));

        ObjectMapper objectMapper = new ObjectMapper();
        Heno henoDatos = objectMapper.readValue(henoJson, Heno.class);

        henoExistente.setNombre(henoDatos.getNombre());
        henoExistente.setPrecioU(henoDatos.getPrecioU());
        henoExistente.setStock(henoDatos.getStock());
        henoExistente.setDescripcionCorta(henoDatos.getDescripcionCorta());
        henoExistente.setDescripcionLarga(henoDatos.getDescripcionLarga());
        henoExistente.setFechaEntrada(henoDatos.getFechaEntrada());
        henoExistente.setEstado(henoDatos.getEstado());
        
        // Manejo automático de estado basado en el stock
        if (henoExistente.getStock() > 0) {
            henoExistente.setActivo(true);
        } else {
            henoExistente.setActivo(false);
        }

        double precioC = henoExistente.getPrecioU() * henoExistente.getStock();
        henoExistente.setPrecioC(precioC);

        if (archivoImagen != null && !archivoImagen.isEmpty()) {
            Map uploadResult = cloudinary.uploader().upload(archivoImagen.getBytes(), ObjectUtils.emptyMap());
            String linkImagen = (String) uploadResult.get("secure_url");
            henoExistente.setImagen(linkImagen);
        }

        Heno henoGuardado = repositorio.save(henoExistente);

        if (idAnimales != null) {
            tipoHenoRepositorio.deleteByHenoId(id);
            for (Long idAnimal : idAnimales) {
                tipoHenoServise.crearTipoHeno(idAnimal, henoGuardado.getIdHeno());
            }
        }

        return henoGuardado;
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
