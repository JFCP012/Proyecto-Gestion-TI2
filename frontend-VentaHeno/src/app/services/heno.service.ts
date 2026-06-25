import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Heno } from '../models/heno.model';

@Injectable({
  providedIn: 'root'
})
export class HenoService {
  private apiUrl = 'http://localhost:8080/Heno/buscar';

  constructor(private http: HttpClient) { }

  buscarHenos(): Observable<Heno[]> {
    return this.http.get<Heno[]>(`${this.apiUrl}`);
  }
}
