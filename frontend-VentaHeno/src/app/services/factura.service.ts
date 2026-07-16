import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {

  private apiUrl = `${API_BASE_URL}/Factura/procesarCompra`;

  constructor(private http: HttpClient) { }

  procesarCompra(compraDTO: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, compraDTO);
  }
}
