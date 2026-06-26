import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CarritoService } from './services/carrito.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend-VentaHeno');
  
  private router = inject(Router);
  carritoService = inject(CarritoService);

  get cantidadEnCarrito() {
    return this.carritoService.obtenerCantidadTotal();
  }

  irAlCarrito() {
    this.router.navigate(['/carrito']);
  }
}
