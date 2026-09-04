import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../models/Cliente';
import { API_BASE_URL } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private apiUrl = `${API_BASE_URL}/Cliente`;

  constructor(private http: HttpClient) { }

  registrarCliente(cliente: Cliente, imagen?: File | null): Observable<Cliente> {
    const formData = new FormData();
    formData.append('cliente', JSON.stringify(cliente));
    if (imagen) {
      formData.append('imagen', imagen);
    }
    return this.http.post<Cliente>(`${this.apiUrl}/registrar`, formData);
  }

  buscarPorCedula(cedula: string): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/buscarPorCedula`, {
      params: { cedula }
    });
  }

  listarTodos(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.apiUrl}/listarTodos`);
  }

  login(cedula: string, clave: string): Observable<Cliente> {
    return this.http.post<Cliente>(`${this.apiUrl}/login`, { cedula, clave });
  }
}
