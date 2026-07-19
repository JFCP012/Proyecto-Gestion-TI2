import { Component, inject, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReportesService } from '../../services/reportes.service';
import { ReporteVentaCliente } from '../../models/reporte-venta.model';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-reportes-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reportes-cliente.component.html',
  styleUrls: ['./reportes-cliente.component.css']
})
export class ReportesClienteComponent implements OnInit {
  private router = inject(Router);
  private reportesService = inject(ReportesService);
  private cdr = inject(ChangeDetectorRef);

  cedulaInput: string = '';
  reporteCliente: ReporteVentaCliente | null = null;
  cargandoReporte: boolean = false;
  errorReporte: string | null = null;

  private logoBase64: string = '';
  private logoAspectRatio: number = 1.0;

  ngOnInit() {
    this.cargarLogo();
  }

  private cargarLogo() {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      this.logoAspectRatio = img.width / img.height;
      this.logoBase64 = canvas.toDataURL('image/png');
    };
    img.src = '/assets/Imagenes/Logo2.png';
  }

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

  descargarPDF() {
    if (!this.reporteCliente || !this.reporteCliente.facturas || this.reporteCliente.facturas.length === 0) return;

    try {
      const doc = new jsPDF();
      doc.setFont("helvetica");

      // Logo
      if (this.logoBase64) {
        const height = 20; 
        const width = height * this.logoAspectRatio;
        doc.addImage(this.logoBase64, 'PNG', 14, 10, width, height);
        
        doc.setFontSize(22);
        doc.setTextColor(56, 161, 105);
        doc.text("AgroHeno", 14 + width + 5, 24);
      } else {
        doc.setFontSize(22);
        doc.setTextColor(56, 161, 105);
        doc.text("AgroHeno", 14, 24);
      }

      // Línea separadora
      doc.setDrawColor(56, 161, 105);
      doc.setLineWidth(0.5);
      doc.line(14, 35, 196, 35);

      // Título
      doc.setFontSize(16);
      doc.setTextColor(30, 41, 59);
      doc.text(`Reporte de Ventas por Cliente: ${this.reporteCliente.cliente ? this.reporteCliente.cliente.nombre : this.reporteCliente.facturas[0].nombreCliente}`, 14, 45);

      // Info general
      doc.setFontSize(11);
      doc.setTextColor(71, 85, 105);
      doc.text(`Cédula: ${this.reporteCliente.cliente ? this.reporteCliente.cliente.cedula : this.reporteCliente.facturas[0].cedulaCliente}`, 14, 55);
      doc.text(`Total Compras: ${this.reporteCliente.totalFacturas}`, 14, 62);
      doc.text(`Total Pacas: ${this.reporteCliente.totalPacas}`, 14, 69);
      doc.text(`Total Invertido: $${this.reporteCliente.montoTotal.toLocaleString('es-CO')}`, 14, 76);

      // Tabla
      const tableBody = this.reporteCliente.facturas.map(f => {
        const detalles = f.detalles.map(d => `${d.tipoHeno}: ${d.cantidad} a $${d.precioUnitario.toLocaleString('es-CO')} = $${d.subtotal.toLocaleString('es-CO')}`).join('\n');
        return [
          `#${f.idFactura}`,
          f.fechaFactura,
          detalles,
          `$${f.envio.toLocaleString('es-CO')}`,
          `$${f.totalVenta.toLocaleString('es-CO')}`
        ];
      });

      autoTable(doc, {
        startY: 85,
        head: [['ID', 'Fecha', 'Detalles', 'Envío', 'Total']],
        body: tableBody,
        theme: 'grid',
        headStyles: { fillColor: [56, 161, 105] },
        styles: { fontSize: 8, cellPadding: 2 },
        columnStyles: { 2: { cellWidth: 70 } } 
      });

      const pageCount = (doc as any).internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(150);
        const pageSize = doc.internal.pageSize;
        const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
        const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
        const text = "Fabricantes de heno";
        const textWidth = doc.getStringUnitWidth(text) * doc.getFontSize() / doc.internal.scaleFactor;
        const x = (pageWidth - textWidth) / 2;
        doc.text(text, x, pageHeight - 10);
      }

      doc.save(`Reporte_Cliente_${this.cedulaInput}_${Date.now()}.pdf`);
    } catch (e: any) {
      console.error('Error al generar PDF:', e);
      alert('Error al generar el PDF: ' + e.message);
    }
  }
}
