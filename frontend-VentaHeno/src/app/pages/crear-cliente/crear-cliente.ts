import { Component, OnInit, inject } from '@angular/core';
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

  cliente: Cliente = {
    cedula: '',
    nombre: '',
    telefono: '',
    direccion: ''
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
    if (!this.cliente.cedula || !this.cliente.nombre || !this.cliente.telefono) {
      this.errorMsg = 'Por favor complete todos los campos obligatorios (*).';
      return;
    }

    this.loading = true;
    this.successMsg = '';
    this.errorMsg = '';

    this.clienteService.registrarCliente(this.cliente, this.imagenSeleccionada).subscribe({
      next: (res) => {
        this.successMsg = '¡Cliente registrado con éxito!';
        this.loading = false;
        setTimeout(() => {
          this.router.navigate(['/factura'], { queryParams: { cedula: res.cedula } });
        }, 1500);
      },
      error: (err) => {
        console.error('Error al registrar cliente:', err);
        this.errorMsg = typeof err.error === 'string'
          ? err.error
          : (err.error?.message || 'Ocurrió un error al registrar el cliente en el servidor.');
        this.loading = false;
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
