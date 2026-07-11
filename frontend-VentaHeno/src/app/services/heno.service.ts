import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Heno } from '../models/heno.model';

@Injectable({
  providedIn: 'root'
})
export class HenoService {
  constructor(private http: HttpClient) { }

  buscarHenos(): Observable<Heno[]> {
    return this.http.get<Heno[]>(`http://localhost:8080/Heno/buscar`);
  }

  buscarHenosPorTipo(nombre: string): Observable<Heno[]> {
    return this.http.get<Heno[]>(`http://localhost:8080/Heno/buscarPorTipo?nombre=${nombre}`);
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

    return this.http.post<Heno>(`http://localhost:8080/Heno/crear`, formData);
  }

  buscarHenosPorNombre(nombreHeno: string): Observable<Heno[]> {
    return this.http.get<Heno[]>(`http://localhost:8080/Heno/buscarPorNombre?nombreHeno=${nombreHeno}`);
  }

  buscarPorId(id: number): Observable<Heno> {
    return this.http.get<Heno>(`http://localhost:8080/Heno/buscarPorId?id=${id}`);
  }

  buscarTodosHenos(): Observable<Heno[]> {
    return this.http.get<Heno[]>(`http://localhost:8080/Heno/buscarTodos`);
  }

  buscarAnimales(idHeno: number): Observable<number[]> {
    return this.http.get<number[]>(`http://localhost:8080/Heno/buscarAnimales?idHeno=${idHeno}`);
  }

  cambiarEstadoHeno(idHeno: number, activo: boolean): Observable<Heno> {
    return this.http.put<Heno>(`http://localhost:8080/Heno/cambiarEstado/${idHeno}?activo=${activo}`, {});
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
    return this.http.put<Heno>(`http://localhost:8080/Heno/editar/${idHeno}`, formData);
  }

}
