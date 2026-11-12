import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PollutionService } from '../../services/pollution';
import { Pollution } from '../../models/pollution.model';

@Component({
  selector: 'app-pollution-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './pollution-detail.html'
})

export class PollutionDetailComponent implements OnInit {
  private pollutionService = inject(PollutionService);

  @Input() id!: string | number;

  pollution = signal<Pollution | null>(null);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    if (this.id) {
      this.pollutionService.getPollutionById(this.id).subscribe({
        next: (data) => {
          this.pollution.set(data);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set('Impossible de charger cette pollution.');
          this.loading.set(false);
          console.error(err);
        }
      });
    }
  }
}

