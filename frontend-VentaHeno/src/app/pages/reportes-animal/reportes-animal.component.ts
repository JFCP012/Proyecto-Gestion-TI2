import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReportesService } from '../../services/reportes.service';
import { ReporteFacturasAnimal, Animal } from '../../models/reporte-venta.model';

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

  reporteAnimal: ReporteFacturasAnimal | null = null;
  cargandoReporte: boolean = false;
  errorReporte: string | null = null;

  paginaActual: number = 1;
  itemsPorPagina: number = 5;

  ngOnInit() {
    this.cargarAnimales();
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
}