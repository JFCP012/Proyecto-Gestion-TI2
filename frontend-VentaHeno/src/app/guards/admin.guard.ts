import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AdminService } from '../services/admin.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const adminService = inject(AdminService);
  const router = inject(Router);

  if (adminService.isAdminLoggedIn()) {
    return true;
  }

  // Si no está logueado como administrador, redirigir a la tienda
  router.navigate(['/producto']);
  return false;
};
