import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent {
  carritoService = inject(CarritoService);
  private router = inject(Router);

  items$ = this.carritoService.cartItems$;

  incrementar(item: any) {
    this.carritoService.actualizarCantidad(item.producto.idHeno, item.cantidad + 1);
  }

  decrementar(item: any) {
    this.carritoService.actualizarCantidad(item.producto.idHeno, item.cantidad - 1);
  }

  onCantidadChange(event: any, item: any) {
    let nuevaCantidad = parseInt(event.target.value, 10);
    if (isNaN(nuevaCantidad) || nuevaCantidad < 1) {
      nuevaCantidad = 1;
    } else if (nuevaCantidad > item.producto.stock) {
      nuevaCantidad = item.producto.stock;
    }
    event.target.value = nuevaCantidad;
    this.carritoService.actualizarCantidad(item.producto.idHeno, nuevaCantidad);
  }

  remover(idHeno: number) {
    this.carritoService.removerDelCarrito(idHeno);
  }

  vaciar() {
    this.carritoService.vaciarCarrito();
  }

  getTotal(): number {
    return this.carritoService.obtenerTotal();
  }

  procederPago() {
    alert('Funcionalidad de pago en construcción');
    // this.router.navigate(['/pago']);
  }
  
  volver() {
    this.router.navigate(['/producto']);
  }
}
