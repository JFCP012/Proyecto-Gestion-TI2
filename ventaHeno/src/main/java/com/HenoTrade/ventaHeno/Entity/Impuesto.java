package com.HenoTrade.ventaHeno.Entity;

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
@Table(name = "impuesto")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Impuesto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idImpuesto", nullable = false, unique = true)
    private Long idImpuesto;

    @ManyToOne
    @JoinColumn(name = "idAdmin", referencedColumnName = "idAdmin")
    private Admin Admin;

    @Column(name = "nombre", nullable = false)
    private String nombre;

    @Column(name = "porcentaje", nullable = false)
    private Double porcentaje;

}
