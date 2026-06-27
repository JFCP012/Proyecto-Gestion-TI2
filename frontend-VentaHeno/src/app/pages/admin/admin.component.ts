import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  private router = inject(Router);
  private adminService = inject(AdminService);

  linkCrear() {
    this.router.navigate(['/crear-producto']);
  }

  volverTienda() {
    this.router.navigate(['/producto']);
  }

  cerrarSesion() {
    this.adminService.logoutAdmin();
    this.router.navigate(['/producto']);
  }
}
