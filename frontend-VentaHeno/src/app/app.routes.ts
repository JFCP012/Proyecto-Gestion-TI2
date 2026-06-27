import { Routes } from '@angular/router';
import { ProductoComponent } from './pages/producto/producto.component';
import { CrearProducto } from './pages/crear-producto/crear-producto';
import { DetalleProducto } from './pages/detalle-producto/detalle-producto';
import { CarritoComponent } from './pages/carrito/carrito.component';
import { Factura } from './pages/factura/factura';

export const routes: Routes = [
    { path: '', component: ProductoComponent },
    { path: 'producto', component: ProductoComponent },
    { path: 'crear-producto', component: CrearProducto },
    { path: 'detalle-producto/:id', component: DetalleProducto },
    { path: 'carrito', component: CarritoComponent },
    { path: 'factura', component: Factura },
];