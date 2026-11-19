import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PollutionService } from '../../services/pollution';
import { Pollution } from '../../models/pollution.model';
import { POLLUTION_TYPES } from '../../models/pollution.constants';

@Component({
  selector: 'app-pollution-list',
  imports: [FormsModule, RouterLink, DatePipe],
  templateUrl: './pollution-list.html',
  styleUrl: './pollution-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PollutionListComponent implements OnInit {
  private pollutionService = inject(PollutionService);

  private rawPollutions = signal<Pollution[]>([]);
  readonly pollutionTypes = POLLUTION_TYPES;

  isLoading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);
  searchTerm = signal<string>('');
  selectedType = signal<string>('');

  filteredPollutions = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const type = this.selectedType();

    return this.rawPollutions().filter((p) => {
      const matchTerm =
        p.titre.toLowerCase().includes(term) || p.lieu.toLowerCase().includes(term);
      const matchType = type === '' || p.type === type;
      return matchTerm && matchType;
    });
  });

  ngOnInit(): void {
    this.pollutionService.getPollutions().subscribe({
      next: (data) => {
        this.rawPollutions.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erreur de chargement :', err);
        this.errorMessage.set('Impossible de charger les données de pollution.');
        this.isLoading.set(false);
      }
    });
  }

  onDelete(id: number | undefined): void {
    if (id === undefined) return;

    if (confirm('Voulez-vous vraiment supprimer cette pollution ?')) {
      this.pollutionService.deletePollution(id).subscribe({
        next: () => {
          this.rawPollutions.update((list) => list.filter((p) => p.id !== id));
        },
        error: (err) => {
          console.error('Erreur lors de la suppression :', err);
          this.errorMessage.set('Impossible de supprimer cette pollution.');
        }
      });
    }
  }
}
