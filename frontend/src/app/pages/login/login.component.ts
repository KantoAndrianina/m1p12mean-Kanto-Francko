import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [ApiService]
})
export class LoginComponent {
  loginForm: FormGroup;
  message: string = '';

  constructor(private fb: FormBuilder, private apiService: ApiService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

  // onSubmit() {
  //   if (this.loginForm.valid) {
  //     const credentials = {
  //       email: this.loginForm.value.email,
  //       mot_de_passe: this.loginForm.value.password
  //     };
  
  //     this.apiService.login(credentials).subscribe(
  //       (response: any) => {
  //         alert('Connexion réussie !');
  //         console.log('Utilisateur connecté', response);
  //       },
  //       (error: any) => {
  //         console.error('Erreur complète de connexion', error);
  //         if (error.status === 400) {
  //           alert('Erreur : ' + (error.error.message || 'Bad Request'));
  //         } else {
  //           alert('Erreur inconnue : ' + error.status);
  //         }
  //       }
  //     );
  //   }
  // }

  onSubmit() {
    if (this.loginForm.valid) {
      const credentials = {
        email: this.loginForm.value.email,
        mot_de_passe: this.loginForm.value.password
      };
  
      this.apiService.login(credentials).subscribe(
        (response: any) => {
          
          console.log('Réponse complète du serveur :', response);
  
          localStorage.setItem('token', response.token);
          console.log("✅ Token stocké dans localStorage :", localStorage.getItem('token'));
          
          const decodedToken: any = jwtDecode(response.token);
          const role = decodedToken.role; 
  
          console.log('Rôle extrait du token :', role);
          alert('Connexion réussie !'+role);
          switch (role) {
            case 'manager':
              this.router.navigate(['/manager-dashboard']);
              break;
            case 'mecanicien':
              this.router.navigate(['/mecanicien-dashboard']);
              break;
            case 'client':
              this.router.navigate(['/client-dashboard']);
              break;
            default:
              this.router.navigate(['/login']); 
          }
        },
        (error: any) => {
          console.error('Erreur complète de connexion', error);
          if (error.status === 400) {
            alert('Erreur : ' + (error.error.message || 'Bad Request'));
          } else {
            alert('Erreur inconnue : ' + error.status);
          }
        }
      );
    }
  }
  
}
