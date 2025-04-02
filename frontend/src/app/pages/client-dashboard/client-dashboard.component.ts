import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-client-dashboard',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.css']
})
export class ClientDashboardComponent implements OnInit {
  vehiculeForm: FormGroup;
  vehicules: any[] = [];
  isModalOpen = false;
  vehiculeEnCours: any = null;

  constructor(private apiService: ApiService, private router: Router, private fb: FormBuilder) {
    this.vehiculeForm = this.fb.group({
      marque: ['', Validators.required],
      modele: ['', Validators.required],
      annee: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]],
      immatriculation: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const role = this.apiService.getUserRole();
    if (role !== 'client') {
      alert("Accès refusé !");
      this.router.navigate(['/login']);
      return;
    }

    this.chargerVehicules();
  }

  chargerVehicules() {
    const token = localStorage.getItem('token');
    console.log("📌 Token récupéré :", token);
    this.apiService.getVehiculesClient().subscribe(
      (response: any) => {
        console.log("📌 Réponse complète de l'API :", response);
        this.vehicules = response;
        console.log("Véhicules récupérés :", this.vehicules);
      },
      (error) => {
        console.error("Erreur lors de la récupération des véhicules :", error);
        console.log("Détails de l'erreur :", error.message, error.status, error.error);
      }
    );
  }

  ajouterVehicule() {
    if (this.vehiculeForm.invalid) {
      alert("Veuillez remplir tous les champs correctement.");
      return;
    }

    const vehiculeData = this.vehiculeForm.value;
    this.apiService.ajouterVehicule(vehiculeData).subscribe(
      (response: any) => {
        alert(response.message);
        this.vehicules.push(response.vehicule);
        this.vehiculeForm.reset();
      },
      (error:any) => {
        console.error("Erreur lors de l'ajout du véhicule", error);
      }
    );
  }
  
  supprimerVehicule(id: string) {
    if (confirm("Voulez-vous vraiment supprimer ce véhicule ?")) {
      this.apiService.supprimerVehicule(id).subscribe(
        () => {
          alert("Véhicule supprimé !");
          this.chargerVehicules(); // Recharger la liste après suppression
        },
        (error:any) => {
          console.error("Erreur de suppression :", error);
          alert("Erreur lors de la suppression !");
        }
      );
    }
  }

  modifierVehicule(vehicule: any) {
    this.vehiculeEnCours = vehicule;
    this.vehiculeForm.patchValue(vehicule);
    this.isModalOpen = true;
  }

  fermerModal() {
    this.isModalOpen = false;
    this.vehiculeEnCours = null;
  }

  validerModification() {
    if (this.vehiculeForm.valid && this.vehiculeEnCours) {
      const vehiculeModifie = { ...this.vehiculeEnCours, ...this.vehiculeForm.value };
      this.apiService.modifierVehicule(vehiculeModifie).subscribe(
        (response: any) => {
          alert("Véhicule mis à jour !");
          this.fermerModal();
          this.chargerVehicules(); // Rafraîchir la liste
        },
        (error: any) => {
          console.error("Erreur lors de la modification :", error);
          alert("Erreur de modification !");
        }
      );
    }
  }

  logout() {
    this.apiService.logout();
    this.router.navigate(['/login']);
  }
}
