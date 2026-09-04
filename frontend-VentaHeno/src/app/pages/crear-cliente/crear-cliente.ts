import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ClienteService } from '../../services/cliente.service';
import { Cliente } from '../../models/Cliente';

@Component({
  selector: 'app-crear-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-cliente.html',
  styleUrl: './crear-cliente.css'
})
export class CrearCliente implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private clienteService = inject(ClienteService);
  private cdr = inject(ChangeDetectorRef);

  cliente: Cliente = {
    cedula: '',
    nombre: '',
    telefono: '',
    direccion: '',
    clave: ''
  };

  imagenSeleccionada: File | null = null;
  imagenPreview: string | null = null;

  loading = false;
  successMsg = '';
  errorMsg = '';

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['cedula']) {
        this.cliente.cedula = params['cedula'];
      }
    });
  }

  validarCedula() {
    if (this.cliente.cedula && !/^[0-9]*$/.test(this.cliente.cedula)) {
      this.cliente.cedula = this.cliente.cedula.replace(/[^0-9]/g, '');
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imagenSeleccionada = file;

      // Crear URL de vista previa
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagenPreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  quitarImagen(event?: Event) {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    this.imagenSeleccionada = null;
    this.imagenPreview = null;
    const fileInput = document.getElementById('imagen') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  registrarCliente() {
    if (!this.cliente.cedula || !this.cliente.nombre || !this.cliente.telefono || !this.cliente.clave) {
      this.errorMsg = 'Por favor complete todos los campos obligatorios (*).';
      this.cdr.detectChanges();
      return;
    }

    const cedulaLimpia = this.cliente.cedula.trim();

    if (!/^[0-9]+$/.test(cedulaLimpia)) {
      this.errorMsg = 'La cédula debe contener únicamente números.';
      this.cdr.detectChanges();
      return;
    }

    this.loading = true;
    this.successMsg = '';
    this.errorMsg = '';
    this.cliente.cedula = cedulaLimpia;
    this.cdr.detectChanges();

    this.clienteService.registrarCliente(this.cliente, this.imagenSeleccionada).subscribe({
      next: (res) => {
        this.successMsg = '¡Cliente registrado con éxito!';
        this.loading = false;
        this.cdr.detectChanges();
        setTimeout(() => {
          this.router.navigate(['/factura'], { queryParams: { cedula: res.cedula } });
        }, 1500);
      },
      error: (err) => {
        console.error('Error al registrar cliente:', err);
        this.loading = false;
        if (err.error && typeof err.error === 'object' && err.error.message) {
          this.errorMsg = err.error.message;
        } else if (typeof err.error === 'string' && err.error) {
          this.errorMsg = err.error;
        } else {
          this.errorMsg = `Ya existe un cliente registrado con la cédula ${cedulaLimpia}. Inicie sesión o use otra cédula.`;
        }
        this.cdr.detectChanges();
      }
    });
  }

  volver() {
    this.router.navigate(['/factura']);
  }
  inicio() {
    this.router.navigate(['/producto']);
  }
}
