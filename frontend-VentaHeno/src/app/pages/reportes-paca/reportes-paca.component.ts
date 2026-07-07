import { Component, inject, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReportesService } from '../../services/reportes.service';
import { HenoService } from '../../services/heno.service';
import { Heno } from '../../models/heno.model';
import { ReporteFacturasHeno } from '../../models/reporte-venta.model';

@Component({
  selector: 'app-reportes-paca',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reportes-paca.component.html',
  styleUrls: ['./reportes-paca.component.css']
})
export class ReportesPacaComponent implements OnInit {
  private router = inject(Router);
  private reportesService = inject(ReportesService);
  private henoService = inject(HenoService);
  private cdr = inject(ChangeDetectorRef);

  henosList: Heno[] = [];
  pacaSeleccionada: string | null = null;

  reportePaca: ReporteFacturasHeno | null = null;
  cargandoReporte: boolean = false;
  errorReporte: string | null = null;

  paginaActual: number = 1;
  itemsPorPagina: number = 5;

  ngOnInit() {
    this.cargarListaHenos();
  }

  cargarListaHenos() {
    this.henoService.buscarHenos().subscribe({
      next: (data) => {
        this.henosList = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar lista de henos para reportes:', err);
      }
    });
  }

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
