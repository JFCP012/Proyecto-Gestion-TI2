import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CarritoService } from '../../services/carrito.service';
import { FacturaService } from '../../services/factura.service';
import { Factura as FacturaModel } from '../../models/Factura';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-factura',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './factura.html',
  styleUrls: ['./factura.css']
})
export class Factura implements OnInit {
  carritoService = inject(CarritoService);
  facturaService = inject(FacturaService);
  private router = inject(Router);

  items$ = this.carritoService.cartItems$;
  subtotal = 0;
  envio = 15000;
  total = 0;

  factura: Partial<FacturaModel> = {
    nombreC: '',
    cedulaC: '',
    direccionC: '',
    telefonoC: ''
  };

  compraExitosa = false;
  procesando = false;

  ngOnInit() {
    this.subtotal = this.carritoService.obtenerTotal();
    if (this.subtotal === 0) {
      this.router.navigate(['/carrito']);
    }
    this.total = this.subtotal + this.envio;
  }

  procesarCompra() {
    if (!this.factura.nombreC || !this.factura.cedulaC || !this.factura.direccionC || !this.factura.telefonoC) {
      alert('Por favor complete todos los campos');
      return;
    }

    this.procesando = true;
    this.factura.fechaFactura = new Date().toISOString().split('T')[0];
    this.factura.totalVenta = this.total;
    this.factura.envio = this.envio;
    
    this.items$.pipe(take(1)).subscribe(items => {
        const detalles = items.map(item => ({
            idHeno: item.producto.idHeno,
            cantidad: item.cantidad
        }));

        const compraDTO = {
            factura: {
                ...this.factura,
                vendedor: { cedulaV: 1054544178 } // Vendedor proporcionado
            },
            detalles: detalles
        };
        
        this.facturaService.procesarCompra(compraDTO).subscribe({
            next: (res) => {
                console.log('Factura generada en BD:', res);
                this.compraExitosa = true;
                this.procesando = false;
                this.carritoService.vaciarCarrito();
            },
            error: (err) => {
                console.error('Error al procesar la compra', err);
                alert('Ocurrió un error al procesar la compra. Revisa el stock disponible.');
                this.procesando = false;
            }
        });
    });
  }

  volverInicio() {
    this.router.navigate(['/producto']);
  }
  
  volverCarrito() {
    this.router.navigate(['/carrito']);
  }
}
