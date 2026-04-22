import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-security-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './security-dashboard.component.html',
  styleUrl: './security-dashboard.component.css'
})
export class SecurityDashboardComponent {
  // Accessing the auth service to handle logout
  private authService = inject(AuthService);

  // Simply logs the security guard out and returns them to the landing page
  logout() {
    this.authService.logout();
  }
}
