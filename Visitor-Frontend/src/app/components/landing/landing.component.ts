import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
  
  // Injecting built-in services for routing and authentication
  private authService = inject(AuthService);
  private router = inject(Router);

  // showForm controls what we see on the screen: 'none' (buttons), 'resident' (form), or 'security' (form)
  showForm: 'none' | 'resident' | 'security' = 'none';

  // Data objects to hold user input for both types of login
  residentLoginData = { email: '', password: '', LoginFrom: 'Resident' };
  securityLoginData = { email: '', password: '', LoginFrom: 'Security' };

  // Variables to hold error messages and loading status
  residentError: string | null = null;
  securityError: string | null = null;
  loadingResident = false;
  loadingSecurity = false;

  // Simple function to switch between the selection screen and login forms
  setViewMode(mode: 'none' | 'resident' | 'security') {
    this.showForm = mode;
    this.residentError = null; // Clear errors when switching
    this.securityError = null;
  }




  // Handle Resident Login
  onSubmitResident() {
    this.loadingResident = true;
    this.residentError = null;

    this.authService.login(this.residentLoginData).subscribe({ //SEND THIS DATA TO BACKEND
      next: (response) => {
        // DOUBLE CHECK: Even if login is successful, make sure the role is "Resident"
        if (response.role === 'Resident') {
          this.router.navigate(['/dashboard']);
        } else {
          this.residentError = 'You are not a Resident. Please use correct portal.';
          this.loadingResident = false;
        }
      },
      error: () => {
        this.residentError = 'Invalid email or password.';
        this.loadingResident = false;
      }
    });
  }

  // Handle Security Login
  onSubmitSecurity() {
    this.loadingSecurity = true;
    this.securityError = null;

    this.authService.login(this.securityLoginData).subscribe({
      next: (response) => {
        // DOUBLE CHECK: Make sure the role is "Security"
        if (response.role === 'Security') {
          this.router.navigate(['/security-dashboard']);
        } else {
          this.securityError = 'You are not a Security Guard. Please use correct portal.';
          this.loadingSecurity = false;
        }
      },
      error: () => {
        this.securityError = 'Invalid email or password.';
        this.loadingSecurity = false;
      }
    });
  }
}
