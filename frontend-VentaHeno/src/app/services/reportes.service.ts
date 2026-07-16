import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReporteVentaMensual, ReporteFacturasAnimal, Animal, ReporteFacturasHeno, ReporteVentaCliente } from '../models/reporte-venta.model';
import { API_BASE_URL } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  private apiUrl = `${API_BASE_URL}/Reportes`;
  private animalUrl = `${API_BASE_URL}/animal`;

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

  obtenerReportePorCliente(cedula: string): Observable<ReporteVentaCliente> {
    return this.http.get<ReporteVentaCliente>(`${this.apiUrl}/ventasPorCliente?cedula=${cedula}`);
  }
}
