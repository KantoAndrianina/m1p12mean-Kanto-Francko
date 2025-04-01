import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-mecanicien-dashboard',
  imports: [],
  templateUrl: './mecanicien-dashboard.component.html',
  styleUrl: './mecanicien-dashboard.component.css'
})
export class MecanicienDashboardComponent {
  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    const role = this.apiService.getUserRole();
    if (role !== 'client') {
      alert("Accès refusé !");
      this.router.navigate(['/login']);
    }
  }
}
