import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HenoService } from '../../services/heno.service';
import { Heno } from '../../models/heno.model';

@Component({
  selector: 'app-crear-producto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-producto.html',
  styleUrl: './crear-producto.css',
})
export class CrearProducto {
  constructor(
    private henoService: HenoService,
    private router: Router
  ) { }

  heno: Heno = {
    nombre: '',
    precioU: 0,
    stock: 0,
    descripcionCorta: '',
    descripcionLarga: '',
    precioC: 0,
    fechaEntrada: '',
    estado: '',
  }
  idAnimales: number[] = [];

  toggleAnimal(event: any, id: number) {
    if (event.target.checked) {
      this.idAnimales.push(id);
    } else {
      this.idAnimales = this.idAnimales.filter(animalId => animalId !== id);
    }
  }
  imagen: File | null = null;
  imagenPreview: string | ArrayBuffer | null = null;
  loading = false;
  successMsg = '';
  errorMsg = '';

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imagen = file;

      // Generate image preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagenPreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  crearHeno() {
    const file = this.imagen;
    if (!file) {
      this.errorMsg = 'Debe seleccionar una imagen';
      return;
    }

    this.loading = true;
    this.successMsg = '';
    this.errorMsg = '';

    if (!this.idAnimales || this.idAnimales.length === 0) {
      this.errorMsg = 'Debe seleccionar al menos un animal';
      return;
    }

    this.henoService.crearHeno(this.heno, file, this.idAnimales).subscribe({
      next: (heno) => {
        console.log('Heno creado con éxito:', heno);
        this.successMsg = '¡Producto creado con éxito!';
        this.loading = false;
        setTimeout(() => {
          this.volver();
        }, 1500);
      },
      error: (err) => {
        console.error('Error al crear heno:', err);
        this.errorMsg = 'Ocurrió un error al guardar el producto. Por favor intente de nuevo.';
        this.loading = false;
      }
    });
  }

  volver() {
    this.router.navigate(['/producto']);
  }
}

