import { Routes } from '@angular/router';
import { ProductoComponent } from './pages/producto/producto.component';

export const routes: Routes = [
    { path: '', component: ProductoComponent },
    { path: 'producto', component: ProductoComponent }
];