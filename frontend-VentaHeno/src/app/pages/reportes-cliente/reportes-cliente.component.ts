import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReportesService } from '../../services/reportes.service';
import { ReporteVentaCliente } from '../../models/reporte-venta.model';

@Component({
  selector: 'app-reportes-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reportes-cliente.component.html',
  styleUrls: ['./reportes-cliente.component.css']
})
export class ReportesClienteComponent {
  private router = inject(Router);
  private reportesService = inject(ReportesService);
  private cdr = inject(ChangeDetectorRef);

  cedulaInput: string = '';
  reporteCliente: ReporteVentaCliente | null = null;
  cargandoReporte: boolean = false;
  errorReporte: string | null = null;

  // Paginación
  paginaActual: number = 1;
  itemsPorPagina: number = 5;

  volverAdmin() {
    this.router.navigate(['/admin']);
  }

  get facturasPaginadas() {
    if (!this.reporteCliente || !this.reporteCliente.facturas) return [];
    const indiceInicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const indiceFin = indiceInicio + this.itemsPorPagina;
    return this.reporteCliente.facturas.slice(indiceInicio, indiceFin);
  }

  get paginas() {
    if (!this.reporteCliente || !this.reporteCliente.facturas) return [];
    const totalPaginas = Math.ceil(this.reporteCliente.facturas.length / this.itemsPorPagina);
    return Array.from({ length: totalPaginas }, (_, i) => i + 1);
  }

  cambiarPagina(pagina: number) {
    this.paginaActual = pagina;
    this.cdr.detectChanges();
  }

  generarReporteCliente() {
    const cedula = this.cedulaInput?.trim();
    if (!cedula) {
      this.errorReporte = 'Por favor, ingresa una cédula válida.';
      this.cdr.detectChanges();
      return;
    }

    this.cargandoReporte = true;
    this.errorReporte = null;
    this.reporteCliente = null;
    this.paginaActual = 1;
    this.cdr.detectChanges();

    this.reportesService.obtenerReportePorCliente(cedula).subscribe({
      next: (reporte) => {
        this.reporteCliente = reporte;
        this.cargandoReporte = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al generar el reporte:', err);
        this.errorReporte = 'Ocurrió un error al cargar el reporte. Por favor, verifica que la cédula sea correcta y reintente.';
        this.cargandoReporte = false;
        this.cdr.detectChanges();
      }
    });
  }
}
