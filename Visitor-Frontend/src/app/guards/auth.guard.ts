import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * These "Guards" act like security checkpoints at the gate.
 * They check if a user is logged in and if they have the right permission (Role)
 * before letting them see a specific page.
 */

// 1. ADMIN GUARD: Only lets Admin users pass
export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if logged in AND if role is 'Admin'
  if (authService.isAuthenticated() && authService.getRole() === 'Admin') {
    return true; // Door stays open
  }

  // If not Admin, kick them back to the Admin Login page
  router.navigate(['/adminlogin6789']);
  return false; // Door closes
};

// 2. RESIDENT GUARD: Only lets Resident users pass
export const residentGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if logged in AND if role is 'Resident'
  if (authService.isAuthenticated() && authService.getRole() === 'Resident') {
    return true; 
  }

  // If not Resident, kick them back to the main landing page
  router.navigate(['/']);
  return false;
};

// 3. SECURITY GUARD: Only lets Security users pass
export const securityGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if logged in AND if role is 'Security'
  if (authService.isAuthenticated() && authService.getRole() === 'Security') {
    return true;
  }

  // If not Security, kick them back to the main landing page
  router.navigate(['/']);
  return false;
};
