import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResidentService, Resident } from '../../../services/resident.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-resident-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './resident-profile.component.html',
  styleUrl: './resident-profile.component.css'
})
export class ResidentProfileComponent implements OnInit {
  private residentService = inject(ResidentService);
  private authService = inject(AuthService);

  residentData: Resident | null = null;
  loading = false;
  error: string | null = null;
  success: string | null = null;
  
  formData = {
    name: '',
    email: '',
    flatNumber: '',
    phoneNumber: ''
  };

  pwdData = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  pwdLoading = false;
  pwdError: string | null = null;
  pwdSuccess: string | null = null;

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    const id = this.authService.getUserId();
    if (!id) return;

    this.loading = true;
    this.residentService.getResident(id).subscribe({
      next: (data) => {
        this.residentData = data;
        this.formData = {
          name: data.name,
          email: data.email,
          flatNumber: data.flatNumber,
          phoneNumber: data.phoneNumber
        };
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load profile data.';
        this.loading = false;
      }
    });
  }

  onUpdate() {
    const id = this.authService.getUserId();
    if (!id) return;

    this.loading = true;
    this.success = null;
    this.error = null;

    this.residentService.updateResident(id, this.formData).subscribe({
      next: () => {
        this.success = 'Profile updated successfully!';
        localStorage.setItem('name', this.formData.name);
        this.loadProfile();
        this.loading = false;
        // Hide success message after 3 seconds
        setTimeout(() => this.success = null, 3000);
      },
      error: (err) => {
        this.error = err.error?.message || err.error || 'Could not update profile. Please check your details.';
        this.loading = false;
        setTimeout(() => this.error = null, 5000);
      }
    });
  }

  onChangePassword() {
    if (this.pwdData.newPassword !== this.pwdData.confirmPassword) {
      this.pwdError = 'The new passwords do not match.';
      return;
    }

    this.pwdLoading = true;
    this.pwdError = null;
    this.pwdSuccess = null;

    this.authService.changePassword(this.pwdData).subscribe({
      next: () => {
        this.pwdSuccess = 'Your password has been changed!';
        this.pwdData = { oldPassword: '', newPassword: '', confirmPassword: '' };
        this.pwdLoading = false;
        setTimeout(() => this.pwdSuccess = null, 3000);
      },
      error: (err) => {
        let errorMsg = 'Password change failed.';
        
        // ASP.NET Validation Errors (like MinLength) are inside err.error.errors
        if (err.error?.errors) {
          const firstError = Object.values(err.error.errors)[0] as string[];
          errorMsg = firstError[0] || errorMsg;
        } 
        // Logic failures (like Incorrect Password) are inside err.error.message
        else if (err.error?.message) {
          errorMsg = err.error.message;
        }

        this.pwdError = errorMsg;
        this.pwdLoading = false;
        setTimeout(() => this.pwdError = null, 5000);
      }
    });
  }
}
