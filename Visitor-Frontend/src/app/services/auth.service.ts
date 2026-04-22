import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

// Defines the shape of the data we get back when logging in
export interface LoginResponse {
  id: number;
  token: string;
  role: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  // The address of our Backend API
  private apiUrl = 'https://localhost:7055/api/Auth'; 

  // BehaviorSubject keeps track of the "Current User". 
  // Any part of the app can "subscribe" to this to know who is logged in.
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // When the app starts, check if a "token" exists in the browser's memory (localStorage)
    const token = localStorage.getItem('token');
    if (token) {
      // If a token exists, rebuild the user object from stored data
      this.currentUserSubject.next({ 
        id: Number(localStorage.getItem('id')),
        token, 
        role: localStorage.getItem('role'), 
        name: localStorage.getItem('name') 
      });
    }
  }

  // Handles the Login Request
  login(credentials: any): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        // SUCCESS: Save the user's data into browser memory (localStorage)
        // This is what keeps the user logged in even if they refresh the page.
        localStorage.setItem('id', response.id.toString());
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role);
        localStorage.setItem('name', response.name);
        
        // Update the "Current User" status across the app
        this.currentUserSubject.next(response);
      })
    );
  }

  // Logs the user out and clears all stored data
  logout() {
    localStorage.clear();      // Clear browser memory
    this.currentUserSubject.next(null); // Reset the "Current User" to nothing
    this.router.navigate(['/']); // Go back to landing page
  }

  // Helper functions to quickly get specific info about the logged-in user
  getRole(): string | null {
    return localStorage.getItem('role');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token'); // Returns true if a token exists
  }

  getUserId(): number | null {
    const id = localStorage.getItem('id');
    return id ? Number(id) : null;
  }

  // Sends a request to change the password
  changePassword(data: any): Observable<any> {
    const headers = { 'Authorization': `Bearer ${this.getToken()}` };
    return this.http.post(`${this.apiUrl}/change-password`, data, { headers });
  }
}
