import { Component, inject, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router'; 
import { PollutionService } from '../../services/pollution';

export function datePasseeOuAujourdhui(control: AbstractControl): ValidationErrors | null {
  if (!control.value) {
    return null;
  }

  // Récupère la date du jour en heure locale au format YYYY-MM-DD
  const now = new Date();
  const annee = now.getFullYear();
  const mois = String(now.getMonth() + 1).padStart(2, '0');
  const jour = String(now.getDate()).padStart(2, '0');
  const aujourdhuiStr = `${annee}-${mois}-${jour}`;

  // Comparaison directe des chaînes "YYYY-MM-DD"
  if (control.value > aujourdhuiStr) {
    return { dateFutur: true };
  }

  return null;
}

@Component({
  selector: 'app-pollution-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pollution-form.html',
  styleUrl: './pollution-form.scss'
})
export class PollutionForm {
  private pollutionService = inject(PollutionService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private el = inject(ElementRef);

  pollutionForm: FormGroup;

  private now = new Date();
  dateMax: string = `${this.now.getFullYear()}-${String(this.now.getMonth() + 1).padStart(2, '0')}-${String(this.now.getDate()).padStart(2, '0')}`;
  
  typesPollution: string[] = [
    'Plastique',
    'Chimique',
    'Dépôt sauvage',
    'Eau',
    'Air',
    'Autre'
  ];

  constructor() {
    this.pollutionForm = this.fb.group({
      titre: ['', Validators.required],
      type: ['', Validators.required],
      description: ['', Validators.required],
      dateObservation: ['', [Validators.required, datePasseeOuAujourdhui]],
      lieu: ['', Validators.required],
      latitude: [null, [Validators.required, Validators.min(-90), Validators.max(90)]],
      longitude: [null, [Validators.required, Validators.min(-180), Validators.max(180)]],
      photoUrl: ['', Validators.pattern(/^(https?:\/\/).+/)]
    });
  }

  get f() {
    return this.pollutionForm.controls;
  }

  onSubmit(): void {
    if (this.pollutionForm.valid) {
      this.pollutionService.addPollution(this.pollutionForm.value).subscribe({
        next: (nouvellePollution) => {
          alert('Pollution créée avec succès !');
          this.pollutionForm.reset();
          this.router.navigate(['/pollutions']);
        },
        error: (err) => {
          console.error('Erreur lors de la création :', err);
          alert('Erreur lors de la création de la pollution');
        }
      });
    } else {
      this.pollutionForm.markAllAsTouched();

      setTimeout(() => {
        const premierInvalide = this.el.nativeElement.querySelector('.ng-invalid') as HTMLElement | null;

        if (premierInvalide) {
          premierInvalide.scrollIntoView({ behavior: 'smooth', block: 'center' });
          premierInvalide.focus();
        }
      });
    }
  }
}