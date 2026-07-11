import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  private router = inject(Router);
  private adminService = inject(AdminService);

  // Variables para reportes
  menuReportesAbierto: boolean = false;

  irAGestionHenos() {
    this.router.navigate(['/gestion-henos']);
  }

  volverTienda() {
    this.router.navigate(['/producto']);
  }

  cerrarSesion() {
    this.adminService.logoutAdmin();
    this.router.navigate(['/producto']);
  }

  toggleMenuReportes() {
    this.menuReportesAbierto = !this.menuReportesAbierto;
  }

  irAReportesMes() {
    this.router.navigate(['/reportes-mes']);
  }

  irAReportesAnimal() {
    this.router.navigate(['/reportes-animal']);
  }

  irAReportesPaca() {
    this.router.navigate(['/reportes-paca']);
  }
}
