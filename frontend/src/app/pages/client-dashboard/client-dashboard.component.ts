import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-client-dashboard',
  imports: [],
  templateUrl: './client-dashboard.component.html',
  styleUrl: './client-dashboard.component.css'
})
export class ClientDashboardComponent {
  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    const role = this.apiService.getUserRole();
    if (role !== 'client') {
      alert("Accès refusé !");
      this.router.navigate(['/login']);
    }
  }
}
