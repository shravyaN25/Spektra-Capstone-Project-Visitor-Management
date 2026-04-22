import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-resident-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './resident-dashboard.component.html',
  styleUrl: './resident-dashboard.component.css'
})
export class ResidentDashboardComponent {
  private authService = inject(AuthService);

  logout() {
    this.authService.logout();
  }
}
