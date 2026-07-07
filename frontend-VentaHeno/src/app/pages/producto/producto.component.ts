import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core'; // 1. Importar ChangeDetectorRef
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HenoService } from '../../services/heno.service';
import { AdminService } from '../../services/admin.service';
import { Heno } from '../../models/heno.model';
import { Router } from '@angular/router';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {
  constructor(private router: Router) { }

  henos: Heno[] = [];
  errorMsg = '';
  categoriaSeleccionada = '';

  // Variables para el modal de login de Admin
  mostrarModalLogin = false;
  idAdminInput: number | null = null;
  claveInput = '';
  loginError = '';

  private henoService = inject(HenoService);
  private adminService = inject(AdminService);
  private cdr = inject(ChangeDetectorRef); // 2. Inyectar el detector de cambios
  private carritoService = inject(CarritoService);

  ngOnInit() {
    // No cargamos ningún producto al iniciar la página.
    // Solo se mostrarán cuando el usuario presione un filtro.
  }

  get cantidadEnCarrito(): number {
    return this.carritoService.obtenerCantidadTotal();
  }

  irAlCarrito() {
    this.router.navigate(['/carrito']);
  }

  cargarHenos(setCategoria = true) {
    if (setCategoria) {
      this.categoriaSeleccionada = 'Todos';
    } else {
      this.categoriaSeleccionada = '';
    }
    this.henoService.buscarHenos().subscribe({
      next: (data) => {
        this.henos = data.filter((h: Heno) => h.stock > 0 && h.estado !== 'Inactivo');
        console.log(this.henos);
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.errorMsg = 'Error al conectar con el backend: ' + error.message;
        console.error('Error al traer los henos:', error);
      }
    });
  }

  filtrarHenos(nombre: string) {
    this.categoriaSeleccionada = nombre;
    this.henoService.buscarHenosPorTipo(nombre).subscribe({
      next: (data) => {
        this.henos = data.filter((h: Heno) => h.stock > 0 && h.estado !== 'Inactivo');
        console.log('Henos filtrados:', this.henos);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al filtrar henos:', err);
        this.henos = [];
        this.cdr.detectChanges();
      }
    });
  }

  abrirModalLogin() {
    this.mostrarModalLogin = true;
    this.idAdminInput = null;
    this.claveInput = '';
    this.loginError = '';
    this.cdr.detectChanges();
  }

  cerrarModalLogin() {
    this.mostrarModalLogin = false;
    this.cdr.detectChanges();
  }

  submitLoginAdmin() {
    if (!this.idAdminInput || !this.claveInput) {
      this.loginError = 'Por favor complete todos los campos';
      this.cdr.detectChanges();
      return;
    }

    this.adminService.loginAdmin(this.idAdminInput, this.claveInput).subscribe({
      next: (isValid) => {
        if (isValid) {
          this.mostrarModalLogin = false;
          this.router.navigate(['/admin']);
        } else {
          this.loginError = 'ID de Admin o clave incorrectos';
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al iniciar sesión como Admin:', err);
        this.loginError = 'Error de conexión con el servidor';
        this.cdr.detectChanges();
      }
    });
  }



  buscarHenosPorNombre(nombre: string) {
    this.categoriaSeleccionada = '';
    this.henoService.buscarHenosPorNombre(nombre).subscribe({
      next: (data) => {
        this.henos = data.filter((h: Heno) => h.stock > 0 && h.estado !== 'Inactivo');
        console.log('Henos filtrados:', this.henos);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al filtrar henos:', err);
        this.henos = [];
        this.cdr.detectChanges();
      }
    });
  }

  detallePorId(idHeno: number | undefined) {
    if (!idHeno) {
      this.errorMsg = 'ID de producto no válido';
      return;
    }
    console.log('ID:', idHeno);
    this.router.navigate(['/detalle-producto', idHeno]);
  }

  getHeroImageUrl(): string {
    switch (this.categoriaSeleccionada) {
      case 'Equinos':
        return "url('https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&q=80&w=1400')";
      case 'Bovinos':
        return "url('https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&q=80&w=1400')";
      case 'Ovinos':
        return "url('https://images.unsplash.com/photo-1484557985045-edf25e08da73?auto=format&fit=crop&q=80&w=1400')";
      case 'Todos':
      default:
        return "url('../assets/Imagenes/caballo_todos.png')";
    }
  }
}
