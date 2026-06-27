import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReporteVentaMensual } from '../models/reporte-venta.model';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  private apiUrl = 'http://localhost:8080/Reportes';

  constructor(private http: HttpClient) { }

  obtenerReportePorMes(anio: number, mes: number): Observable<ReporteVentaMensual> {
    return this.http.get<ReporteVentaMensual>(`${this.apiUrl}/ventasPorMes?anio=${anio}&mes=${mes}`);
  }
}
