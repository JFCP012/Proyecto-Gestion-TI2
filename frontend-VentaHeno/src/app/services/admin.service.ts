import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private apiUrl = 'http://localhost:8080/Admin';

  constructor(private http: HttpClient) { }

  loginAdmin(idAdmin: number, clave: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/login?idAdmin=${idAdmin}&clave=${encodeURIComponent(clave)}`)
      .pipe(
        tap(isValid => {
          if (isValid) {
            sessionStorage.setItem('isAdmin', 'true');
          }
        })
      );
  }

  isAdminLoggedIn(): boolean {
    return sessionStorage.getItem('isAdmin') === 'true';
  }

  logoutAdmin() {
    sessionStorage.removeItem('isAdmin');
  }
}
