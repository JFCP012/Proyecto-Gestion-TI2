import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReportesService } from '../../services/reportes.service';
import { ReporteVentaMensual } from '../../models/reporte-venta.model';

@Component({
  selector: 'app-reportes-mes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reportes-mes.component.html',
  styleUrls: ['./reportes-mes.component.css']
})
export class ReportesMesComponent {
  private router = inject(Router);
  private reportesService = inject(ReportesService);
  private cdr = inject(ChangeDetectorRef);

  mesSeleccionado: string = ''; // Formato esperado "YYYY-MM"
  reporteMensual: ReporteVentaMensual | null = null;
  cargandoReporte: boolean = false;
  errorReporte: string | null = null;

  // Variables de control para la paginación
  paginaActual: number = 1;
  itemsPorPagina: number = 5;

  volverAdmin() {
    this.router.navigate(['/admin']);
  }

  // Corta la lista completa de facturas para devolver solo las 5 correspondientes
  get facturasPaginadas() {
    if (!this.reporteMensual || !this.reporteMensual.facturas) return [];
    const indiceInicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const indiceFin = indiceInicio + this.itemsPorPagina;
    return this.reporteMensual.facturas.slice(indiceInicio, indiceFin);
  }

  // Calcula cuántas páginas de botones se necesitan mapear en la UI
  get paginas() {
    if (!this.reporteMensual || !this.reporteMensual.facturas) return [];
    const totalPaginas = Math.ceil(this.reporteMensual.facturas.length / this.itemsPorPagina);
    return Array.from({ length: totalPaginas }, (_, i) => i + 1);
  }

  cambiarPagina(pagina: number) {
    this.paginaActual = pagina;
    this.cdr.detectChanges(); // Asegura estabilidad visual instantánea al saltar de vista
  }

  generarReporteMensual() {
    if (!this.mesSeleccionado) {
      this.errorReporte = 'Por favor, selecciona un mes válido.';
      return;
    }

    const [anioStr, mesStr] = this.mesSeleccionado.split('-');
    const anio = parseInt(anioStr, 10);
    const mes = parseInt(mesStr, 10);

    this.cargandoReporte = true;
    this.errorReporte = null;
    this.reporteMensual = null;
    this.paginaActual = 1; // Resetea siempre a la primera página con cada nueva búsqueda

    this.reportesService.obtenerReportePorMes(anio, mes).subscribe({
      next: (reporte) => {
        this.reporteMensual = reporte;
        this.cargandoReporte = false;
        this.cdr.detectChanges(); // Fuerza actualización del DOM al recibir la respuesta
      },
      error: (err) => {
        console.error('Error al generar el reporte:', err);
        this.errorReporte = 'Ocurrió un error al cargar el reporte. Por favor, verifica la conexión con el servidor.';
        this.cargandoReporte = false;
        this.cdr.detectChanges();
      }
    });
  }
}