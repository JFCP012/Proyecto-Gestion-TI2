import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReportesService } from '../../services/reportes.service';
import { ReporteFacturasAnimal, Animal } from '../../models/reporte-venta.model';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-reportes-animal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reportes-animal.component.html',
  styleUrls: ['./reportes-animal.component.css']
})
export class ReportesAnimalComponent implements OnInit {
  private router = inject(Router);
  private reportesService = inject(ReportesService);
  private cdr = inject(ChangeDetectorRef);

  animalesList: Animal[] = [];
  animalSeleccionadoId: number | null = null;

  private logoBase64: string = '';
  private logoAspectRatio: number = 1.0;

  reporteAnimal: ReporteFacturasAnimal | null = null;
  cargandoReporte: boolean = false;
  errorReporte: string | null = null;

  paginaActual: number = 1;
  itemsPorPagina: number = 5;

  ngOnInit() {
    this.cargarLogo();
    this.cargarAnimales();
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

  cargarAnimales() {
    this.reportesService.obtenerAnimales().subscribe({
      next: (data) => {
        // Filtramos para asegurar que no salgan cosas raras y solo los 3 tipos principales si los hay
        this.animalesList = data.filter(a => 
          a.nombre.toLowerCase().includes('bovin') || 
          a.nombre.toLowerCase().includes('ovin') || 
          a.nombre.toLowerCase().includes('equin')
        );
        // Deduplicar por nombre por si la BD tiene duplicados
        this.animalesList = this.animalesList.filter((animal, index, self) =>
          index === self.findIndex((t) => (
            t.nombre.toLowerCase() === animal.nombre.toLowerCase()
          ))
        );

        if (this.animalesList.length > 0) {
          this.seleccionarAnimal(this.animalesList[0].idAnimales, this.animalesList[0].nombre);
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar animales', err);
      }
    });
  }

  getAnimalIcon(nombre: string): string {
    const n = nombre.toLowerCase();
    if (n.includes('bovin')) return 'assets/Imagenes/vaca.png';
    if (n.includes('ovin')) return 'assets/Imagenes/oveja.png';
    if (n.includes('equin')) return 'assets/Imagenes/caballo.png';
    return '';
  }

  seleccionarAnimal(id: number, nombre: string) {
    this.animalSeleccionadoId = id;
    this.generarReporteAnimal();
  }

  volverAdmin() { 
    this.router.navigate(['/admin']); 
  }

  get facturasPaginadas() {
    if (!this.reporteAnimal || !this.reporteAnimal.facturas) return [];
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    return this.reporteAnimal.facturas.slice(inicio, inicio + this.itemsPorPagina);
  }

  get paginas() {
    if (!this.reporteAnimal || !this.reporteAnimal.facturas) return [];
    const total = Math.ceil(this.reporteAnimal.facturas.length / this.itemsPorPagina);
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  cambiarPagina(p: number) { 
    this.paginaActual = p; 
    this.cdr.detectChanges();
  }

  generarReporteAnimal() {
    if (!this.animalSeleccionadoId) { 
      this.errorReporte = 'Selecciona un animal'; 
      return; 
    }
    
    const animalObj = this.animalesList.find(a => a.idAnimales == this.animalSeleccionadoId);
    const nombreAnimal = animalObj ? animalObj.nombre : 'Desconocido';

    this.cargandoReporte = true;
    this.errorReporte = null;
    this.reporteAnimal = null;
    this.paginaActual = 1;

    this.reportesService.obtenerReportePorAnimal(this.animalSeleccionadoId, nombreAnimal).subscribe({
      next: (data) => { 
        this.reporteAnimal = data; 
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
    if (!this.reporteAnimal || !this.reporteAnimal.facturas || this.reporteAnimal.facturas.length === 0) return;

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
      doc.text(`Reporte de Ventas: ${this.reporteAnimal.nombreAnimal}`, 14, 45);

      // Info general
      doc.setFontSize(11);
      doc.setTextColor(71, 85, 105);
      doc.text(`Total Facturas: ${this.reporteAnimal.totalFacturas}`, 14, 55);
      doc.text(`Ingresos Totales: $${this.reporteAnimal.montoTotal.toLocaleString('es-CO')}`, 14, 62);

      // Tabla
      const tableBody = this.reporteAnimal.facturas.map(f => {
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

      doc.save(`Reporte_Animal_${this.reporteAnimal.nombreAnimal}_${Date.now()}.pdf`);
    } catch (e: any) {
      console.error('Error al generar PDF:', e);
      alert('Error al generar el PDF: ' + e.message);
    }
  }
}