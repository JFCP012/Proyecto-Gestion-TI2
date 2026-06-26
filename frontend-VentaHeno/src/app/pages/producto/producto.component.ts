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
export class ProductoComponent implements OnInit {
  constructor(private router: Router) { }

  henos: Heno[] = [];
  errorMsg = '';

  private henoService = inject(HenoService);
  private cdr = inject(ChangeDetectorRef); // 2. Inyectar el detector de cambios

  ngOnInit(): void {
    this.cargarHenos();
  }



  cargarHenos() {
    this.henoService.buscarHenos().subscribe({
      next: (data) => {
        this.henos = data;
        console.log(this.henos);

        this.cdr.detectChanges(); // 3. Avisarle a Angular que el HTML debe actualizarse YA
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
        this.henos = data;
        console.log('Henos filtrados:', this.henos);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al filtrar henos:', err);
        this.henos = []; // Vaciar en caso de error
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
        this.henos = data;
        console.log('Henos filtrados:', this.henos);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al filtrar henos:', err);
        this.henos = []; // Vaciar en caso de error
        this.cdr.detectChanges();
      }
    });
  }
}
