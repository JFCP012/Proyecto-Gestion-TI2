import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReportesService } from '../../services/reportes.service';
import { ReporteFacturasHeno } from '../../models/reporte-venta.model';

@Component({
  selector: 'app-reportes-paca',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reportes-paca.component.html',
  styleUrls: ['./reportes-paca.component.css']
})
export class ReportesPacaComponent {
  private router = inject(Router);
  private reportesService = inject(ReportesService);
  private cdr = inject(ChangeDetectorRef);

  // Tipos de heno estáticos según requerimiento
  tiposPaca = ['Angleton', 'Pangola', 'Heno_Vegetal'];
  pacaSeleccionada: string | null = null;

  reportePaca: ReporteFacturasHeno | null = null;
  cargandoReporte: boolean = false;
  errorReporte: string | null = null;

  paginaActual: number = 1;
  itemsPorPagina: number = 5;

  volverAdmin() { 
    this.router.navigate(['/admin']); 
  }

  get facturasPaginadas() {
    if (!this.reportePaca || !this.reportePaca.facturas) return [];
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    return this.reportePaca.facturas.slice(inicio, inicio + this.itemsPorPagina);
  }

  get paginas() {
    if (!this.reportePaca || !this.reportePaca.facturas) return [];
    const total = Math.ceil(this.reportePaca.facturas.length / this.itemsPorPagina);
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  cambiarPagina(p: number) { 
    this.paginaActual = p; 
    this.cdr.detectChanges();
  }

  seleccionarPaca(nombreHeno: string) {
    this.pacaSeleccionada = nombreHeno;
    this.generarReportePaca();
  }

  generarReportePaca() {
    if (!this.pacaSeleccionada) { 
      this.errorReporte = 'Selecciona un tipo de paca'; 
      return; 
    }

    this.cargandoReporte = true;
    this.errorReporte = null;
    this.reportePaca = null;
    this.paginaActual = 1;

    this.reportesService.obtenerReportePorHeno(this.pacaSeleccionada).subscribe({
      next: (data) => { 
        this.reportePaca = data; 
        this.cargandoReporte = false; 
        this.cdr.detectChanges();
      },
      error: (err) => { 
        console.error(err);
        this.errorReporte = 'Error al consultar las ventas.'; 
        this.cargandoReporte = false; 
        this.cdr.detectChanges();
      }
    });
  }
}
