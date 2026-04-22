import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { AdminLoginComponent } from './components/admin/login/admin-login.component';
import { AdminDashboardComponent } from './components/admin/dashboard/admin-dashboard.component';
import { AdminUsersComponent } from './components/admin/users/admin-users.component';
import { AdminOverviewComponent } from './components/admin/overview/admin-overview.component';
import { AdminVisitorsComponent } from './components/admin/visitors/admin-visitors.component';
import { ResidentDashboardComponent } from './components/resident/dashboard/resident-dashboard.component';
import { ResidentWelcomeComponent } from './components/resident/welcome/resident-welcome.component';
import { ResidentProfileComponent } from './components/resident/profile/resident-profile.component';
import { AddVisitorComponent } from './components/resident/add-visitor/add-visitor.component';
import { SecurityDashboardComponent } from './components/security/dashboard/security-dashboard.component';
import { SecurityWelcomeComponent } from './components/security/welcome/security-welcome.component';
import { SecurityVisitorsComponent } from './components/security/visitors/security-visitors.component';
import { MyVisitorsComponent } from './components/resident/my-visitors/my-visitors.component';
import { adminGuard, residentGuard, securityGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: LandingComponent }, //When user opens app LandingComponent loads
  { path: 'adminlogin6789', component: AdminLoginComponent },
  { 
    path: 'admin-dashboard', 
    component: AdminDashboardComponent, 
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: AdminOverviewComponent },
      { path: 'residents', component: AdminUsersComponent },
      { path: 'visitors', component: AdminVisitorsComponent }
    ]
  },
  { 
    path: 'dashboard', 
    component: ResidentDashboardComponent, 
    canActivate: [residentGuard],
    children: [
      { path: '', component: ResidentWelcomeComponent },
      { path: 'add-visitor', component: AddVisitorComponent },
      { path: 'my-visitors', component: MyVisitorsComponent },
      { path: 'profile', component: ResidentProfileComponent }
    ]
  },
  { 
    path: 'security-dashboard', 
    component: SecurityDashboardComponent, 
    canActivate: [securityGuard],
    children: [
      { path: '', component: SecurityWelcomeComponent },
      { path: 'manage-visitors', component: SecurityVisitorsComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];
