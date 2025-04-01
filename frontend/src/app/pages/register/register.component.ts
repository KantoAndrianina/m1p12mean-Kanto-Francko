import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [ApiService]
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private apiService: ApiService, private router: Router) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(1)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.registerForm.get('confirmPassword')?.setValidators([Validators.required, this.passwordMatchValidator.bind(this)]);
  }

  passwordMatchValidator(control: any): { [key: string]: boolean } | null {
    if (this.registerForm) {
      return control.value === this.registerForm.get('password')?.value
        ? null
        : { passwordMismatch: true };
    }
    return null;
  }

  // onSubmit() {
  //   if (this.registerForm.valid) {
  //     const userData = {
  //       nom: this.registerForm.value.username,
  //       email: this.registerForm.value.email,
  //       mot_de_passe: this.registerForm.value.password,
  //       role: 'client'
  //     };

  //     this.apiService.register(userData).subscribe(
  //       (response:any) => {
  //         console.log('Utilisateur inscrit', response);
  //         alert('Inscription réussie'); 
  //       },
  //       (error:any) => {
  //         console.error('Erreur d\'inscription', error);
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
    if (this.registerForm.valid) {
      const userData = {
        nom: this.registerForm.value.username,
        email: this.registerForm.value.email,
        mot_de_passe: this.registerForm.value.password,
        role: 'client'
      };
  
      this.apiService.register(userData).subscribe(
        (response: any) => {
          console.log('Utilisateur inscrit', response);
  
            localStorage.setItem('token', response.token); 
            const role = this.apiService.getUserRole(); 
            console.log('Rôle après inscription:', role);
  
            alert('Inscription réussie'+role);
  
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
          console.error('Erreur d\'inscription', error);
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
