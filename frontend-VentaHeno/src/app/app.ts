import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CarritoService } from './services/carrito.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('frontend-VentaHeno');

  private router = inject(Router);
  carritoService = inject(CarritoService);

  esRutaExcluida = false;

  ngOnInit() {
    // Escuchar activamente los eventos del Router para actualizar la exclusión del carrito
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.actualizarEstadoExclusion(event.urlAfterRedirects || event.url);
    });

    // Evaluar el estado de la ruta inicial
    this.actualizarEstadoExclusion(this.router.url);
  }

  private actualizarEstadoExclusion(url: string) {
    this.esRutaExcluida = url.includes('/admin') ||
      url.includes('/crear-producto') ||
      url.includes('reportes') ||
      url.includes('/carrito') ||
      url.includes('/factura');
  }

  get cantidadEnCarrito() {
    return this.carritoService.obtenerCantidadTotal();
  }

  get mostrarCarrito() {
    return !this.esRutaExcluida && this.cantidadEnCarrito > 0;
  }

  irAlCarrito() {
    this.router.navigate(['/carrito']);
  }
}
