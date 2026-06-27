import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {

  private apiUrl = 'http://localhost:8080/Factura/procesarCompra';

  constructor(private http: HttpClient) { }

  procesarCompra(compraDTO: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, compraDTO);
  }
}
