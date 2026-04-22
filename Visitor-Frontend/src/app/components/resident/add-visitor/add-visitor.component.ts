import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { VisitorService } from '../../../services/visitor.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-add-visitor',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './add-visitor.component.html'
})
export class AddVisitorComponent {
  private visitorService = inject(VisitorService);
  private authService = inject(AuthService);

  visitorData = {
    fullName: '',
    phoneNumber: '',
    purpose: '',
    expectedArrival: ''
  };

  loading = false;
  error: string | null = null;
  success: string | null = null;
  minDateTime = this.getMinDateTime();

  getMinDateTime(): string {
    const now = new Date();
    // Adjust for timezone to get local date
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 10) + 'T00:00';
  }

  onSubmit() {
    this.loading = true;
    this.error = null;
    this.success = null;

    const residentId = this.authService.getUserId();
    if (!residentId) {
      this.error = 'User not logged in.';
      this.loading = false;
      return;
    }

    const payload = {
      ...this.visitorData,
      residentId: residentId
    };

    this.visitorService.addVisitor(payload).subscribe({
      next: () => {
        this.success = 'Visitor registered successfully!';
        this.loading = false;
        // Reset form
        this.visitorData = { fullName: '', phoneNumber: '', purpose: '', expectedArrival: '' };
        // Clear message after 3s
        setTimeout(() => this.success = null, 3000);
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to register visitor. Please try again.';
        this.loading = false;
      }
    });
  }
}
