import { ChangeDetectorRef, Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HenoService } from '../../services/heno.service';
import { Heno } from '../../models/heno.model';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-detalle-producto',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalle-producto.html',
  styleUrls: ['./detalle-producto.css'],
})
export class DetalleProducto implements OnInit {
  heno: Heno | null = null;
  errorMsg = '';
  cantidad = 1;
  mostrarModalCarrito = false;

  private henoService = inject(HenoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private carritoService = inject(CarritoService);
  @Input() id!: string;

  ngOnInit(): void {
    console.log('El ID del heno recibido es:', this.id);
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = +idParam;
      this.cargarDetalleHeno(id);
    } else {
      this.errorMsg = 'No se proporcionó un ID de producto válido.';
    }
  }

  cargarDetalleHeno(id: number) {
    this.henoService.buscarPorId(id).subscribe({
      next: (data) => {
        this.heno = data;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.errorMsg = 'Error al traer los detalles del heno: ' + error.message;
        console.error('Error al traer detalles:', error);
      }
    });
  }

  incrementarCantidad() {
    if (this.heno && this.cantidad < this.heno.stock) {
      this.cantidad++;
    }
  }

  decrementarCantidad() {
    if (this.cantidad > 1) {
      this.cantidad--;
    }
  }

  onCantidadChange(event: any) {
    let nuevaCantidad = parseInt(event.target.value, 10);
    if (isNaN(nuevaCantidad) || nuevaCantidad < 1) {
      nuevaCantidad = 1;
    } else if (this.heno && nuevaCantidad > this.heno.stock) {
      nuevaCantidad = this.heno.stock;
    }
    this.cantidad = nuevaCantidad;
    event.target.value = nuevaCantidad;
  }

  volver() {
    this.router.navigate(['/producto']);
  }

  agregarAlCarrito() {
    if (this.heno) {
      this.carritoService.agregarAlCarrito(this.heno, this.cantidad);
      this.mostrarModalCarrito = true;
    }
  }

  seguirComprando() {
    this.mostrarModalCarrito = false;
  }

  irAlCarrito() {
    this.mostrarModalCarrito = false;
    this.router.navigate(['/carrito']);
  }
}
