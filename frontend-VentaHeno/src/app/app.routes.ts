import { Routes } from '@angular/router';
import { ProductoComponent } from './pages/producto/producto.component';
import { CrearProducto } from './pages/crear-producto/crear-producto';
import { DetalleProducto } from './pages/detalle-producto/detalle-producto';
import { CarritoComponent } from './pages/carrito/carrito.component';
import { Factura } from './pages/factura/factura';
import { AdminComponent } from './pages/admin/admin.component';
import { ReportesMesComponent } from './pages/reportes-mes/reportes-mes.component';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
    { path: '', component: ProductoComponent },
    { path: 'producto', component: ProductoComponent },
    { path: 'crear-producto', component: CrearProducto, canActivate: [adminGuard] },
    { path: 'detalle-producto/:id', component: DetalleProducto },
    { path: 'carrito', component: CarritoComponent },
    { path: 'factura', component: Factura },
    { path: 'admin', component: AdminComponent, canActivate: [adminGuard] },
    { path: 'reportes-mes', component: ReportesMesComponent, canActivate: [adminGuard] },
];