import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HenoService } from '../../services/heno.service';
import { Heno } from '../../models/heno.model';

@Component({
  selector: 'app-gestion-henos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gestion-henos.component.html',
  styleUrls: ['./gestion-henos.component.css']
})
export class GestionHenosComponent implements OnInit {
  private henoService = inject(HenoService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  henos: Heno[] = [];
  errorMsg = '';
  loading = false;

  ngOnInit() {
    this.cargarTodosHenos();
  }

  cargarTodosHenos() {
    this.loading = true;
    this.henoService.buscarTodosHenos().subscribe({
      next: (data) => {
        // Ordenar por ID para consistencia
        this.henos = data.sort((a, b) => (a.idHeno || 0) - (b.idHeno || 0));
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMsg = 'Error al cargar los productos: ' + err.message;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  crearNuevo() {
    this.router.navigate(['/crear-producto']);
  }

  volver() {
    this.router.navigate(['/admin']);
  }

  editar(idHeno: number) {
    this.router.navigate(['/crear-producto'], { queryParams: { id: idHeno } });
  }

  toggleEstado(heno: Heno) {
    if (!heno.idHeno) return;
    const nuevoEstado = !heno.activo;
    this.henoService.cambiarEstadoHeno(heno.idHeno, nuevoEstado).subscribe({
      next: (res) => {
        this.cargarTodosHenos();
      },
      error: (err) => {
        console.error('Error al cambiar el estado del heno:', err);
        alert('No se pudo cambiar el estado del producto');
      }
    });
  }
}
