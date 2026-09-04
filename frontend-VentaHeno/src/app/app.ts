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
  loginErrorMsg: string = "";
  cedulaErrorMsg: string = "";

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
      this.loginErrorMsg = "";
      this.cedulaErrorMsg = "";
      this.mostrarLoginModal = true;
    }
  }

  validarCedulaInput() {
    if (this.idC && !/^[0-9]*$/.test(this.idC)) {
      this.cedulaErrorMsg = "Solo se permiten números en la cédula.";
      this.idC = this.idC.replace(/[^0-9]/g, '');
    } else {
      this.cedulaErrorMsg = "";
    }
  }

  submitLoginCliente() {
    this.loginErrorMsg = "";
    this.cedulaErrorMsg = "";

    const cedula = this.idC?.trim();
    if (!cedula) {
      this.loginErrorMsg = "Por favor ingrese su cédula.";
      return;
    }

    if (!/^[0-9]+$/.test(cedula)) {
      this.loginErrorMsg = "La cédula solo debe contener números.";
      return;
    }

    if (!this.claveC || this.claveC.trim() === "") {
      this.loginErrorMsg = "Por favor ingrese su clave.";
      return;
    }

    this.clienteService.login(cedula, this.claveC).subscribe({
      next: (isValid) => {
        if (isValid && isValid.cedula) {
          this.clienteLogueado = isValid;
          localStorage.setItem('clienteActivo', JSON.stringify(isValid));
          this.clienteLogueado.imagen = isValid.imagen ?? "";
          this.cerrarModalUsuario();
          this.router.navigate(['/']);
        } else {
          this.loginErrorMsg = "No se encontró la cédula o la clave es incorrecta.";
        }
      },
      error: (error) => {
        console.error('Error al iniciar sesión:', error);
        if (error.status === 404) {
          this.loginErrorMsg = "No existe un cliente registrado con esta cédula.";
        } else if (error.status === 401 || error.status === 400) {
          this.loginErrorMsg = "Cédula o clave incorrecta. Por favor verifique sus datos.";
        } else {
          this.loginErrorMsg = typeof error.error === 'string' && error.error
            ? error.error
            : (error.error?.message || 'No se encontró la cédula ingresada o la contraseña es incorrecta.');
        }
      }
    });
  }

  cerrarModalUsuario() {
    this.mostrarLoginModal = false;
    this.loginErrorMsg = "";
    this.cedulaErrorMsg = "";
  }
  registrarCliente() {
    this.router.navigate(['/crear-cliente']);
    this.cerrarModalUsuario();
  }
  cerrarSesion() {
    localStorage.removeItem('clienteActivo');
    window.location.href = '/';
  }

}
