import { Component, inject, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReportesService } from '../../services/reportes.service';
import { HenoService } from '../../services/heno.service';
import { Heno } from '../../models/heno.model';
import { ReporteFacturasHeno } from '../../models/reporte-venta.model';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

  private logoBase64: string = '';
  private logoAspectRatio: number = 1.0;

  reportePaca: ReporteFacturasHeno | null = null;
  cargandoReporte: boolean = false;
  errorReporte: string | null = null;

  paginaActual: number = 1;
  itemsPorPagina: number = 5;

  ngOnInit() {
    this.cargarLogo();
    this.cargarListaHenos();
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

  getDetalleHenoBuscado(factura: any) {
    if (!factura.detalles || !this.pacaSeleccionada) return null;
    return factura.detalles.find((d: any) => d.tipoHeno.toLowerCase().includes(this.pacaSeleccionada!.toLowerCase()));
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

  descargarPDF() {
    if (!this.reportePaca || !this.reportePaca.facturas || this.reportePaca.facturas.length === 0) return;

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
      doc.text(`Reporte de Ventas por Paca: ${this.reportePaca.nombreHeno.replace('_', ' ')}`, 14, 45);

      // Info general
      doc.setFontSize(11);
      doc.setTextColor(71, 85, 105);
      doc.text(`Total Facturas: ${this.reportePaca.totalFacturas}`, 14, 55);
      doc.text(`Ingresos Totales: $${this.reportePaca.montoTotal.toLocaleString('es-CO')}`, 14, 62);

      // Tabla
      const tableBody = this.reportePaca.facturas.map(f => {
        const detalle = this.getDetalleHenoBuscado(f);
        return [
          `#${f.idFactura}`,
          f.fechaFactura,
          f.nombreCliente,
          f.cedulaCliente,
          detalle ? `$${detalle.precioUnitario.toLocaleString('es-CO')}` : '-',
          detalle ? `${detalle.cantidad} uds` : '-',
          detalle ? `$${detalle.subtotal.toLocaleString('es-CO')}` : '-'
        ];
      });

      autoTable(doc, {
        startY: 70,
        head: [['ID', 'Fecha', 'Cliente', 'Cédula', 'Precio Unit.', 'Cantidad', 'Total (Paca)']],
        body: tableBody,
        theme: 'grid',
        headStyles: { fillColor: [56, 161, 105] },
        styles: { fontSize: 8, cellPadding: 2 }
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

      doc.save(`Reporte_Paca_${this.reportePaca.nombreHeno}_${Date.now()}.pdf`);
    } catch (e: any) {
      console.error('Error al generar PDF:', e);
      alert('Error al generar el PDF: ' + e.message);
    }
  }
}