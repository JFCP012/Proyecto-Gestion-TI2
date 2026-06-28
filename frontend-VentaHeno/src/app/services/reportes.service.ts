import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReporteVentaMensual, ReporteFacturasAnimal, Animal, ReporteFacturasHeno } from '../models/reporte-venta.model';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  private apiUrl = 'http://localhost:8080/Reportes';
  private animalUrl = 'http://localhost:8080/animal';

  constructor(private http: HttpClient) { }

  obtenerReportePorMes(anio: number, mes: number): Observable<ReporteVentaMensual> {
    return this.http.get<ReporteVentaMensual>(`${this.apiUrl}/ventasPorMes?anio=${anio}&mes=${mes}`);
  }

  obtenerReportePorAnimal(idAnimal: number, nombreAnimal: string): Observable<ReporteFacturasAnimal> {
    return this.http.get<ReporteFacturasAnimal>(`${this.apiUrl}/ventasPorAnimal?idAnimal=${idAnimal}&nombreAnimal=${nombreAnimal}`);
  }

  obtenerAnimales(): Observable<Animal[]> {
    return this.http.get<Animal[]>(`${this.animalUrl}/todos`);
  }

  obtenerReportePorHeno(nombreHeno: string): Observable<ReporteFacturasHeno> {
    return this.http.get<ReporteFacturasHeno>(`${this.apiUrl}/ventasPorHeno?nombreHeno=${nombreHeno}`);
  }
}
