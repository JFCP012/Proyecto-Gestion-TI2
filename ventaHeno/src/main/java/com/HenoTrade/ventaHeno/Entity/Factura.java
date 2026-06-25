package com.HenoTrade.ventaHeno.Entity;

import java.sql.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "factura")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Factura {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idFactura", nullable = false, unique = true)
    private Long idFactura;

    @ManyToOne
    @JoinColumn(name = "cedulaV", referencedColumnName = "cedulaV")
    private Vendedor vendedor;

    @Column(name = "fechaFactura", nullable = false)
    private Date fechaFactura;

    @Column(name = "totalVenta", nullable = false)
    private Double totalVenta;

    @Column(name = "nombreC", nullable = false)
    private String nombreC;

    @Column(name = "cedulaC", nullable = false)
    private String cedulaC;

    @Column(name = "direccionC", nullable = false)
    private String direccionC;

    @Column(name = "telefonoC", nullable = false)
    private String telefonoC;

    @Column(name = "envio", nullable = false)
    private double envio;

}
