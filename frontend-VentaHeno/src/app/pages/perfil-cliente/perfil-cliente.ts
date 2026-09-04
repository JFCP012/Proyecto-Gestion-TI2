import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Cliente } from '../../models/Cliente';

@Component({
  selector: 'app-perfil-cliente',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil-cliente.html',
  styleUrl: './perfil-cliente.css'
})
export class PerfilCliente implements OnInit {
  private router = inject(Router);

  cliente: Cliente | null = null;

  ngOnInit() {
    const guardado = localStorage.getItem('clienteActivo');
    if (guardado) {
      try {
        this.cliente = JSON.parse(guardado);
      } catch {
        this.cliente = null;
      }
    }

    // Si no hay sesión activa, redirigir al inicio
    if (!this.cliente) {
      this.router.navigate(['/']);
    }
  }

  volver() {
    this.router.navigate(['/']);
  }


  cerrarSesion() {
    localStorage.removeItem('clienteActivo');
    window.location.href = '/';
  }
}
