import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-manager-dashboard',
  imports: [],
  templateUrl: './manager-dashboard.component.html',
  styleUrl: './manager-dashboard.component.css'
})
export class ManagerDashboardComponent {
  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    const role = this.apiService.getUserRole();
    if (role !== 'manager') {
      alert("Accès refusé !");
      this.router.navigate(['/login']);
    }
  }
}
