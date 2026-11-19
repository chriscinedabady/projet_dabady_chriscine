import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { POLLUTION_TYPES } from '../../models/pollution.constants';
import { Pollution } from '../../models/pollution.model';
import { PollutionService } from '../../services/pollution';

export function datePasseeOuAujourdhui(control: AbstractControl): ValidationErrors | null {
  if (!control.value) {
    return null;
  }

  const now = new Date();
  const annee = now.getFullYear();
  const mois = String(now.getMonth() + 1).padStart(2, '0');
  const jour = String(now.getDate()).padStart(2, '0');
  const aujourdhuiStr = `${annee}-${mois}-${jour}`;

  if (control.value > aujourdhuiStr) {
    return { dateFutur: true };
  }

  return null;
}

export function httpUrlValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value || typeof value !== 'string' || value.trim().length === 0) {
    return null;
  }

  try {
    const url = new URL(value.trim());
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return { invalidUrl: true };
    }
    return null;
  } catch {
    return { invalidUrl: true };
  }
}

@Component({
  selector: 'app-pollution-form',
  imports: [ReactiveFormsModule],
  templateUrl: './pollution-form.html',
  styleUrl: './pollution-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PollutionForm {
  private pollutionService = inject(PollutionService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  readonly id = input<number | undefined, string | number | undefined>(undefined, {
    transform: (val) => (val !== undefined && val !== '' ? Number(val) : undefined)
  });

  readonly isEditMode = computed(() => {
    const currentId = this.id();
    return currentId !== undefined && !Number.isNaN(currentId);
  });

  readonly pollutionResource = rxResource({
    params: () => (this.isEditMode() ? this.id() : undefined),
    stream: ({ params: id }) => this.pollutionService.getPollutionById(id)
  });

  private now = new Date();
  readonly dateMax = `${this.now.getFullYear()}-${String(this.now.getMonth() + 1).padStart(2, '0')}-${String(this.now.getDate()).padStart(2, '0')}`;
  readonly typesPollution = POLLUTION_TYPES;

  pollutionForm = this.fb.nonNullable.group({
    titre: ['', Validators.required],
    type: ['', Validators.required],
    description: ['', Validators.required],
    dateObservation: ['', [Validators.required, datePasseeOuAujourdhui]],
    lieu: ['', Validators.required],
    latitude: [null as number | null, [Validators.required, Validators.min(-90), Validators.max(90)]],
    longitude: [null as number | null, [Validators.required, Validators.min(-180), Validators.max(180)]],
    photoUrl: ['', httpUrlValidator],
    dangerosite: [50, [Validators.required, Validators.min(0), Validators.max(100)]]
  });

  constructor() {
    effect(() => {
      const pollution = this.pollutionResource.value();
      if (pollution && this.isEditMode()) {
        this.pollutionForm.patchValue({
          titre: pollution.titre,
          type: pollution.type,
          description: pollution.description,
          dateObservation: pollution.dateObservation,
          lieu: pollution.lieu,
          latitude: pollution.latitude,
          longitude: pollution.longitude,
          photoUrl: pollution.photoUrl || '',
          dangerosite: pollution.dangerosite
        });
      }
    });

    effect(() => {
      if (this.pollutionResource.error()) {
        alert('Impossible de charger la pollution à modifier.');
        this.router.navigate(['/pollutions']);
      }
    });
  }

  get f() {
    return this.pollutionForm.controls;
  }

  onSubmit(): void {
    if (this.pollutionForm.invalid) {
      this.pollutionForm.markAllAsTouched();
      return;
    }

    const raw = this.pollutionForm.getRawValue();
    const payload: Omit<Pollution, 'id'> = {
      titre: raw.titre,
      type: raw.type,
      description: raw.description,
      dateObservation: raw.dateObservation,
      lieu: raw.lieu,
      latitude: Number(raw.latitude),
      longitude: Number(raw.longitude),
      photoUrl: raw.photoUrl ? raw.photoUrl.trim() : null,
      dangerosite: Number(raw.dangerosite)
    };

    const currentId = this.id();
    const request$ =
      this.isEditMode() && currentId !== undefined
        ? this.pollutionService.updatePollution(currentId, payload)
        : this.pollutionService.addPollution(payload);

    request$.subscribe({
      next: () => {
        alert(
          this.isEditMode()
            ? 'Pollution modifiée avec succès !'
            : 'Pollution créée avec succès !'
        );
        if (!this.isEditMode()) {
          this.pollutionForm.reset();
        }
        this.router.navigate(['/pollutions']);
      },
      error: (err) => {
        console.error('Erreur lors de la sauvegarde :', err);
        alert(
          err?.error?.message ||
            (this.isEditMode()
              ? 'Erreur lors de la modification de la pollution'
              : 'Erreur lors de la création de la pollution')
        );
      }
    });
  }
}
