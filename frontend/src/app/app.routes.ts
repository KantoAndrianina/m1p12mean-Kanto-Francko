import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ManagerDashboardComponent } from './pages/manager-dashboard/manager-dashboard.component';
import { MecanicienDashboardComponent } from './pages/mecanicien-dashboard/mecanicien-dashboard.component';
import { ClientDashboardComponent } from './pages/client-dashboard/client-dashboard.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'manager-dashboard', component: ManagerDashboardComponent },
  { path: 'mecanicien-dashboard', component: MecanicienDashboardComponent },
  { path: 'client-dashboard', component: ClientDashboardComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirection par défaut
  { path: '**', redirectTo: '/login' } // Gère les routes inexistantes
];
