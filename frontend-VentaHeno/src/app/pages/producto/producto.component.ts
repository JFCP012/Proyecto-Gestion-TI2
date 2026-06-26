import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core'; // 1. Importar ChangeDetectorRef
import { CommonModule } from '@angular/common';
import { HenoService } from '../../services/heno.service';
import { Heno } from '../../models/heno.model';

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {
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
}