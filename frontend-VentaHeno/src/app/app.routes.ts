import { Routes } from '@angular/router';
import { ProductoComponent } from './pages/producto/producto.component';
import { CrearProducto } from './pages/crear-producto/crear-producto';

export const routes: Routes = [
    { path: '', component: ProductoComponent },
    { path: 'producto', component: ProductoComponent },
    { path: 'crear-producto', component: CrearProducto }
];