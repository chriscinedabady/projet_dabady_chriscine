import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Pollution } from '../../models/pollution.model';
import { AbstractControl, ValidationErrors } from '@angular/forms';

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
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pollution-form.html',
  styleUrl: './pollution-form.scss'
})
export class PollutionForm {
  @Output() formSubmitted = new EventEmitter<Pollution>();

  pollutionForm: FormGroup;

  // dateMax: string = new Date().toISOString().split('T')[0];
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

  constructor(private fb: FormBuilder) {
    this.pollutionForm = this.fb.group({
      titre: ['', Validators.required],
      type: ['', Validators.required],
      description: ['', Validators.required],
      dateObservation: ['', [Validators.required, datePasseeOuAujourdhui]],
      lieu: ['', Validators.required],
      latitude: [null, [Validators.required, Validators.min(-90), Validators.max(90)]],
      longitude: [null, [Validators.required, Validators.min(-180), Validators.max(180)]],
      photoUrl: ['']
    });
  }
  get f() {
    return this.pollutionForm.controls;
  }

  onSubmit(): void {
    if (this.pollutionForm.valid) {
      this.formSubmitted.emit(this.pollutionForm.value);
    } else {
      this.pollutionForm.markAllAsTouched();

      setTimeout(() => {
        const premierInvalide = document.querySelector(
          '.form-container .ng-invalid'
        ) as HTMLElement | null;

        if (premierInvalide) {
          premierInvalide.scrollIntoView({ behavior: 'smooth', block: 'center' });
          premierInvalide.focus();
        }
      });
    }
  }
}