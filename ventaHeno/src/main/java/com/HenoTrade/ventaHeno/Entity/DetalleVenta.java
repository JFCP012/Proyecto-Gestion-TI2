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
@Table(name = "DetalleVenta")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DetalleVenta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idVenta", nullable = false, unique = true)
    private Long idVenta;

    @ManyToOne
    @JoinColumn(name = "idFactura", referencedColumnName = "idFactura")
    private Factura factura;

    @ManyToOne
    @JoinColumn(name = "idHeno", referencedColumnName = "idHeno")
    private Heno heno;

    @Column(name = "cantidad", nullable = false)
    private Integer cantidad;

}
