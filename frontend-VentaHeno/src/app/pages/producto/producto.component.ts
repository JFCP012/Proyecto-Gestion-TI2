import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core'; // 1. Importar ChangeDetectorRef
import { CommonModule } from '@angular/common';
import { HenoService } from '../../services/heno.service';
import { Heno } from '../../models/heno.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent {
  constructor(private router: Router) { }

  henos: Heno[] = [];
  errorMsg = '';

  private henoService = inject(HenoService);
  private cdr = inject(ChangeDetectorRef); // 2. Inyectar el detector de cambios

  cargarHenos() {
    this.henoService.buscarHenos().subscribe({
      next: (data) => {
        this.henos = data.filter((h: Heno) => h.stock > 0 && h.estado !== 'Inactivo');
        console.log(this.henos);
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.errorMsg = 'Error al conectar con el backend: ' + error.message;
        console.error('Error al traer los henos:', error);
      }
    });
  }

  filtrarHenos(nombre: string) {
    this.henoService.buscarHenosPorTipo(nombre).subscribe({
      next: (data) => {
        this.henos = data.filter((h: Heno) => h.stock > 0 && h.estado !== 'Inactivo');
        console.log('Henos filtrados:', this.henos);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al filtrar henos:', err);
        this.henos = [];
        this.cdr.detectChanges();
      }
    });
  }

  linkcrear() {
    this.router.navigate(['/crear-producto']);
  }

  buscarHenosPorNombre(nombre: string) {
    this.henoService.buscarHenosPorNombre(nombre).subscribe({
      next: (data) => {
        this.henos = data.filter((h: Heno) => h.stock > 0 && h.estado !== 'Inactivo');
        console.log('Henos filtrados:', this.henos);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al filtrar henos:', err);
        this.henos = [];
        this.cdr.detectChanges();
      }
    });
  }

  detallePorId(idHeno: number | undefined) {
    if (!idHeno) {
      this.errorMsg = 'ID de producto no válido';
      return;
    }
    console.log('ID:', idHeno);
    this.router.navigate(['/detalle-producto', idHeno]);
  }
}
