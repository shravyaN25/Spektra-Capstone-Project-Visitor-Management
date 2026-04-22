import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-security-welcome',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './security-welcome.component.html'
})
export class SecurityWelcomeComponent {
  // No stats needed for minimalist look
}
