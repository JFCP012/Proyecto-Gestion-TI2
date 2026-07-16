import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../models/Cliente';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private apiUrl = 'http://localhost:8080/Cliente';

  constructor(private http: HttpClient) { }

  registrarCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(`${this.apiUrl}/registrar`, cliente);
  }

  buscarPorCedula(cedula: string): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/buscarPorCedula`, {
      params: { cedula }
    });
  }

  listarTodos(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.apiUrl}/listarTodos`);
  }
}
