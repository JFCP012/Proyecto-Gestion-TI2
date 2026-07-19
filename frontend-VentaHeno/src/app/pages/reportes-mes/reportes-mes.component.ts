import { Component, inject, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReportesService } from '../../services/reportes.service';
import { ReporteVentaMensual } from '../../models/reporte-venta.model';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-reportes-mes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reportes-mes.component.html',
  styleUrls: ['./reportes-mes.component.css']
})
export class ReportesMesComponent implements OnInit {
  private router = inject(Router);
  private reportesService = inject(ReportesService);
  private cdr = inject(ChangeDetectorRef);

  mesSeleccionado: string = ''; // Formato esperado "YYYY-MM"
  reporteMensual: ReporteVentaMensual | null = null;
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

  descargarPDF() {
    if (!this.reporteMensual || !this.reporteMensual.facturas || this.reporteMensual.facturas.length === 0) return;

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
      doc.text(`Reporte de Ventas: Mes ${this.reporteMensual.mes}/${this.reporteMensual.anio}`, 14, 45);

      // Info general
      doc.setFontSize(11);
      doc.setTextColor(71, 85, 105);
      doc.text(`Total Facturas: ${this.reporteMensual.totalFacturas}`, 14, 55);
      doc.text(`Ingresos Totales: $${this.reporteMensual.montoTotal.toLocaleString('es-CO')}`, 14, 62);

      // Tabla
      const tableBody = this.reporteMensual.facturas.map(f => {
        const detalles = f.detalles.map(d => `${d.tipoHeno}: ${d.cantidad} a $${d.precioUnitario.toLocaleString('es-CO')} = $${d.subtotal.toLocaleString('es-CO')}`).join('\n');
        return [
          `#${f.idFactura}`,
          f.fechaFactura,
          f.nombreCliente,
          f.cedulaCliente,
          detalles,
          `$${f.envio.toLocaleString('es-CO')}`,
          `$${f.totalVenta.toLocaleString('es-CO')}`
        ];
      });

      autoTable(doc, {
        startY: 70,
        head: [['ID', 'Fecha', 'Cliente', 'Cédula', 'Detalles', 'Envío', 'Total']],
        body: tableBody,
        theme: 'grid',
        headStyles: { fillColor: [56, 161, 105] },
        styles: { fontSize: 8, cellPadding: 2 },
        columnStyles: { 4: { cellWidth: 50 } }
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

      doc.save(`Reporte_Mes_${this.reporteMensual.anio}_${this.reporteMensual.mes}_${Date.now()}.pdf`);
    } catch (e: any) {
      console.error('Error al generar PDF:', e);
      alert('Error al generar el PDF: ' + e.message);
    }
  }
}