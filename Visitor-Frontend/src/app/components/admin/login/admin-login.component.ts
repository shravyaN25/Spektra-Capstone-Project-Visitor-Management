import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css'
})
export class AdminLoginComponent {
  // Injecting services needed for the admin portal
  private authService = inject(AuthService);
  private router = inject(Router);

  // Model to capture admin input
  loginData = { email: '', password: '', LoginFrom: 'Admin' };
  error: string | null = null;
  loading = false;

  // Handles the Admin Login Submission
  onSubmit() {
    this.loading = true;
    this.error = null;

    this.authService.login(this.loginData).subscribe({
      next: (res) => {
        // IMPORTANT: Verify that the person logging in is actually an Admin
        if (res.role === 'Admin') {
          this.router.navigate(['/admin-dashboard']);
        } else {
          this.error = 'Authorized only for Administrators.';
          this.loading = false;
        }
      },
      error: () => {
        this.error = 'Invalid admin credentials.';
        this.loading = false;
      }
    });
  }
}
