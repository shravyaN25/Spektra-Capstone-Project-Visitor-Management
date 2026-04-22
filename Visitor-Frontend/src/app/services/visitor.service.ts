import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Visitor {
  id: number;
  fullName: string;
  phoneNumber: string;
  purpose: string;
  residentId: number;
  residentName?: string;
  status: string;
  expectedArrival: string;
  createdAt: string;
  entryTime?: string;
  exitTime?: string;
  flatNumber?: string;
}

@Injectable({
  providedIn: 'root'
})
export class VisitorService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7055/api/visitors';

  private getHeaders() {
    return new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
  }

  addVisitor(visitor: any): Observable<any> {
    return this.http.post(this.apiUrl, visitor, { headers: this.getHeaders() });
  }

  getPendingVisitors(): Observable<any> {
    return this.http.get(`${this.apiUrl}/pending`, { headers: this.getHeaders() });
  }

  getMyVisitors(): Observable<any> {
    return this.http.get(`${this.apiUrl}/my-visitors`, { headers: this.getHeaders() });
  }

  getEnteredVisitors(): Observable<any> {
    return this.http.get(`${this.apiUrl}/entered`, { headers: this.getHeaders() });
  }

  getAllVisitors(): Observable<any> {
    return this.http.get(this.apiUrl, { headers: this.getHeaders() });
  }

  updateStatus(id: number, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/status`, { status }, { headers: this.getHeaders() });
  }

  verifyOtp(id: number, otp: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/verify-otp`, { otp }, { headers: this.getHeaders() });
  }

  deleteVisitor(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
