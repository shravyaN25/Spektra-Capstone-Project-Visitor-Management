import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Resident {
  id: number;
  name: string;
  email: string;
  flatNumber: string;
  phoneNumber: string;
}

@Injectable({
  providedIn: 'root'
})
export class ResidentService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7055/api/Residents';

  private getHeaders() {
    return new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
  }

  getResidents(): Observable<Resident[]> {
    return this.http.get<Resident[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getResident(id: number): Observable<Resident> {
    return this.http.get<Resident>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  createResident(resident: any): Observable<Resident> {
    return this.http.post<Resident>(this.apiUrl, resident, { headers: this.getHeaders() });
  }

  updateResident(id: number, resident: any): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, resident, { headers: this.getHeaders() });
  }

  deleteResident(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
