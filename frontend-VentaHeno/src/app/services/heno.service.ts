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

  crearHeno(heno: any, imagen: File): Observable<Heno> {
    const formData = new FormData();

    // 1. Enviamos el String plano, pero bajo el nombre 'heno'
    formData.append('heno', JSON.stringify(heno));

    // 2. Adjuntamos el archivo bajo el nombre 'imagen'
    formData.append('imagen', imagen);

    return this.http.post<Heno>(`http://localhost:8080/Heno/crear`, formData);
  }

  buscarHenosPorNombre(nombreHeno: string): Observable<Heno[]> {
    return this.http.get<Heno[]>(`http://localhost:8080/Heno/buscarPorNombre?nombreHeno=${nombreHeno}`);
  }
}
