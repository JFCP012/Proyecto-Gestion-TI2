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
@Table(name = "Asignar_Impuesto")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class Asignar_Impuesto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idAsg")
    private Long idAsg;

    @ManyToOne
    @JoinColumn(name = "idImpuesto", referencedColumnName = "idImpuesto")
    private Impuesto impuesto;

    @ManyToOne
    @JoinColumn(name = "idHeno", referencedColumnName = "idHeno")
    private Heno heno;
}
