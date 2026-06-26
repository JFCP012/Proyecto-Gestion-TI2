import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../models/cart-item.model';
import { Heno } from '../models/heno.model';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItems.asObservable();

  constructor() {
    this.cargarDelLocalStorage();
  }

  private guardarEnLocalStorage(items: CartItem[]) {
    localStorage.setItem('carrito', JSON.stringify(items));
  }

  private cargarDelLocalStorage() {
    const data = localStorage.getItem('carrito');
    if (data) {
      try {
        this.cartItems.next(JSON.parse(data));
      } catch (e) {
        console.error('Error parseando carrito de localStorage', e);
      }
    }
  }

  agregarAlCarrito(producto: Heno, cantidad: number) {
    if (!producto.idHeno) return; // Validación básica
    
    const currentItems = this.cartItems.getValue();
    const index = currentItems.findIndex(item => item.producto.idHeno === producto.idHeno);

    if (index !== -1) {
      // Si ya existe, incrementar la cantidad respetando el stock
      const nuevaCantidad = currentItems[index].cantidad + cantidad;
      if (nuevaCantidad <= producto.stock) {
        currentItems[index].cantidad = nuevaCantidad;
      } else {
        currentItems[index].cantidad = producto.stock; // tope máximo
      }
    } else {
      // Agregar nuevo producto
      currentItems.push({ producto, cantidad });
    }

    this.cartItems.next([...currentItems]);
    this.guardarEnLocalStorage(currentItems);
  }

  removerDelCarrito(idHeno: number) {
    const currentItems = this.cartItems.getValue();
    const nuevosItems = currentItems.filter(item => item.producto.idHeno !== idHeno);
    this.cartItems.next(nuevosItems);
    this.guardarEnLocalStorage(nuevosItems);
  }

  actualizarCantidad(idHeno: number, cantidad: number) {
    const currentItems = this.cartItems.getValue();
    const index = currentItems.findIndex(item => item.producto.idHeno === idHeno);

    if (index !== -1) {
      if (cantidad <= 0) {
        this.removerDelCarrito(idHeno);
        return;
      }
      
      if (cantidad <= currentItems[index].producto.stock) {
        currentItems[index].cantidad = cantidad;
        this.cartItems.next([...currentItems]);
        this.guardarEnLocalStorage(currentItems);
      }
    }
  }

  vaciarCarrito() {
    this.cartItems.next([]);
    this.guardarEnLocalStorage([]);
  }

  obtenerTotal(): number {
    return this.cartItems.getValue().reduce((total, item) => total + (item.producto.precioU * item.cantidad), 0);
  }

  obtenerCantidadTotal(): number {
    return this.cartItems.getValue().reduce((total, item) => total + item.cantidad, 0);
  }
}
