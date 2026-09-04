import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarritoService } from './services/carrito.service';
import { ClienteService } from './services/cliente.service';
import { filter } from 'rxjs/operators';
import { Cliente } from './models/Cliente';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('frontend-VentaHeno');

  clienteService = inject(ClienteService);
  private router = inject(Router);
  carritoService = inject(CarritoService);

  esRutaExcluida = false;
  mostrarLoginModal = false;
  clienteLogueado: Cliente | null = null;
  idC: string = "";
  claveC: string = "";


  ngOnInit() {
    // Si ya existe un cliente guardado en el navegador, cargarlo
    const clienteGuardado = localStorage.getItem('clienteActivo');
    if (clienteGuardado) {
      try {
        this.clienteLogueado = JSON.parse(clienteGuardado);
      } catch (e) {
        console.error('Error al cargar cliente desde localStorage:', e);
      }
    }

    // Escuchar activamente los eventos del Router para actualizar la exclusión de vistas
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
      url.includes('/gestion-henos');
  }

  get cantidadEnCarrito() {
    return this.carritoService.obtenerCantidadTotal();
  }

  get mostrarCarrito() {
    return !this.esRutaExcluida &&
      !this.router.url.includes('/carrito') &&
      !this.router.url.includes('/factura') &&
      this.cantidadEnCarrito > 0;
  }

  irAlCarrito() {
    this.router.navigate(['/carrito']);
  }

  abrirModalUsuario() {
    if (this.clienteLogueado) {
      this.router.navigate(['/perfil-cliente']);
    } else {
      this.mostrarLoginModal = true;
    }
  }

  submitLoginCliente() {
    this.clienteService.login(this.idC, this.claveC).subscribe({
      next: (isValid) => {
        if (isValid) {
          this.clienteLogueado = isValid;
          localStorage.setItem('clienteActivo', JSON.stringify(isValid));
          this.clienteLogueado.imagen = isValid.imagen ?? "";
          this.cerrarModalUsuario();
          this.router.navigate(['/']);
        }
      },
      error: (error) => {
        console.error('Error al iniciar sesión:', error);
      }
    });
  }

  cerrarModalUsuario() {
    this.mostrarLoginModal = false;
  }
  registrarCliente() {
    this.router.navigate(['/crear-cliente']);
    this.mostrarLoginModal = false;
  }
  cerrarSesion() {
    localStorage.removeItem('clienteActivo');
    window.location.href = '/';
  }

}
