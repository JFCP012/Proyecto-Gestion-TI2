import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Heno } from '../models/heno.model';
import { API_BASE_URL } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class HenoService {
  private apiUrl = `${API_BASE_URL}/Heno`;

  constructor(private http: HttpClient) { }

  buscarHenos(): Observable<Heno[]> {
    return this.http.get<Heno[]>(`${this.apiUrl}/buscar`);
  }

  buscarHenosPorTipo(nombre: string): Observable<Heno[]> {
    return this.http.get<Heno[]>(`${this.apiUrl}/buscarPorTipo?nombre=${nombre}`);
  }

  crearHeno(heno: any, imagen: File, idAnimales?: number[]): Observable<Heno> {
    const formData = new FormData();

    // 1. Enviamos el String plano, pero bajo el nombre 'heno'
    formData.append('heno', JSON.stringify(heno));

    // 2. Adjuntamos el archivo bajo el nombre 'imagen'
    formData.append('imagen', imagen);

    // 3. Adjuntamos los idAnimales si están presentes
    if (idAnimales && idAnimales.length > 0) {
      idAnimales.forEach(id => formData.append('idAnimales', id.toString()));
    }

    return this.http.post<Heno>(`${this.apiUrl}/crear`, formData);
  }

  buscarHenosPorNombre(nombreHeno: string): Observable<Heno[]> {
    return this.http.get<Heno[]>(`${this.apiUrl}/buscarPorNombre?nombreHeno=${nombreHeno}`);
  }

  buscarPorId(id: number): Observable<Heno> {
    return this.http.get<Heno>(`${this.apiUrl}/buscarPorId?id=${id}`);
  }

  buscarTodosHenos(): Observable<Heno[]> {
    return this.http.get<Heno[]>(`${this.apiUrl}/buscarTodos`);
  }

  buscarAnimales(idHeno: number): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiUrl}/buscarAnimales?idHeno=${idHeno}`);
  }

  cambiarEstadoHeno(idHeno: number, activo: boolean): Observable<Heno> {
    return this.http.put<Heno>(`${this.apiUrl}/cambiarEstado/${idHeno}?activo=${activo}`, {});
  }

  editarHeno(idHeno: number, heno: any, imagen: File | null, idAnimales?: number[]): Observable<Heno> {
    const formData = new FormData();
    formData.append('heno', JSON.stringify(heno));
    if (imagen) {
      formData.append('imagen', imagen);
    }
    if (idAnimales && idAnimales.length > 0) {
      idAnimales.forEach(id => formData.append('idAnimales', id.toString()));
    }
    return this.http.put<Heno>(`${this.apiUrl}/editar/${idHeno}`, formData);
  }

}
