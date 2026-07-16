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

  registrarCliente() {
    if (!this.cliente.cedula || !this.cliente.nombre || !this.cliente.telefono) {
      this.errorMsg = 'Por favor complete todos los campos obligatorios';
      return;
    }

    this.loading = true;
    this.successMsg = '';
    this.errorMsg = '';

    this.clienteService.registrarCliente(this.cliente).subscribe({
      next: (res) => {
        this.successMsg = '¡Cliente registrado con éxito!';
        this.loading = false;
        setTimeout(() => {
          this.router.navigate(['/factura'], { queryParams: { cedula: res.cedula } });
        }, 1500);
      },
      error: (err) => {
        console.error('Error al registrar cliente:', err);
        this.errorMsg = 'Ocurrió un error al registrar el cliente. Intente nuevamente.';
        this.loading = false;
      }
    });
  }

  volver() {
    this.router.navigate(['/factura']);
  }
}
