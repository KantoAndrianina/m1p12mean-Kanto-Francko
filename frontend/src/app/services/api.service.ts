import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../environments/environment';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

interface LoginResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = environment.apiUrl; 

  constructor(private http: HttpClient) { }

  register(userData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiUrl}users/register`, userData, { headers });
  }

  // login(credentials: any): Observable<any> {
  //   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  //   return this.http.post(`${this.apiUrl}users/login`, credentials, { headers });
  // }

  login(credentials: any): Observable<LoginResponse> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  
    return this.http.post<LoginResponse>(`${this.apiUrl}users/login`, credentials, { headers }).pipe(
      tap(response => {
        console.log("Réponse complète du backend :", response); // Affiche TOUTE la réponse
  
        if (response?.token) {
          localStorage.setItem('token', response.token);
          console.log("Token stocké :", localStorage.getItem('token'));
        } else {
          console.error("Aucun token reçu !");
        }
      }),
      catchError(error => {
        console.error("Erreur de connexion :", error);
        return throwError(() => error);
      })
    );
  }

  setUserRole(role: string): void {
    localStorage.setItem('userRole', role);
  }

  getUserRole(): string | null {
    const token = localStorage.getItem('token'); 
    if (!token) return null;

    try {
      const decodedToken: any = jwtDecode(token);  
      return decodedToken.role || null;  
    } catch (error) {
      console.error('Erreur de décodage du token:', error);
      return null;
    }
  }

  getVehiculesClient(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `${token}`,
      'Content-Type': 'application/json'
    });
  
    console.log("Headers envoyés :", headers);
    return this.http.get(`${this.apiUrl}vehicules/all`, { headers });
  }
  
  ajouterVehicule(vehiculeData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `${this.getToken()}`,
      'Content-Type': 'application/json'
    });
  
    return this.http.post(`${this.apiUrl}vehicules/add`, vehiculeData, { headers });
  }

  modifierVehicule(vehicule: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `${token}`,
      'Content-Type': 'application/json'
    });
  
    return this.http.put(`${this.apiUrl}vehicules/${vehicule._id}`, vehicule, { headers });
  }
  

  supprimerVehicule(idVehicule: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `${this.getToken()}`,
      'Content-Type': 'application/json'
    });
  
    return this.http.delete(`${this.apiUrl}vehicules/${idVehicule}`, { headers });
  }
  
  // getUserRole(): string {
  //   const token = this.getToken();
  //   if (!token) return '';
  
  //   try {
  //     const payload = JSON.parse(atob(token.split('.')[1])); // Décodage du token JWT
  //     return payload.role || '';
  //   } catch (e) {
  //     return '';
  //   }
  // }
  
  getToken(): string {
    return localStorage.getItem('token') || '';
  }
  
  logout() {
    localStorage.removeItem('token');
    alert("Déconnecté !");
  }
  
}