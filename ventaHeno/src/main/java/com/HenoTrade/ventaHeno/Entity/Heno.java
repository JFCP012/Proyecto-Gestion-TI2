package com.HenoTrade.ventaHeno.Entity;

import java.sql.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "heno")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Heno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idHeno", nullable = false, unique = true)
    private Long idHeno;

    @Column(name = "nombre", nullable = false)
    private String nombre;

    @Column(name = "precioU", nullable = false)
    private Double precioU;

    @Column(name = "stock", nullable = false)
    private Integer stock;

    @Column(name = "descripcionCorta", nullable = true, length = 255)
    private String descripcionCorta;

    @Column(name = "descripcionLarga", nullable = true, length = 2000)
    private String descripcionLarga;

    @Column(name = "precioC", nullable = false)
    private Double precioC;

    @Column(name = "fechaEntrada", nullable = false)
    private Date fechaEntrada;

    @Column(name = "estado", nullable = false)
    private String estado;

    @Column(name = "imagen", length = 255)
    private String imagen;

}
