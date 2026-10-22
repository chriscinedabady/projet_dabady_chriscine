import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { PollutionService } from '../../services/pollution';
import { Pollution } from '../../models/pollution.model';

@Component({
  selector: 'app-pollution-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './pollution-list.html',
  styleUrl: './pollution-list.scss'
})

export class PollutionListComponent implements OnInit{
  private pollutionService = inject(PollutionService);

  // private rawPollutions = toSignal(this.pollutionService.getPollutions(), { initialValue: [] });
  private rawPollutions = signal<Pollution[]>([]);
  searchTerm = signal<string>('');
  selectedType = signal<string>('');

  filteredPollutions = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const type = this.selectedType();

    return this.rawPollutions().filter(p => {
      const matchTerm = p.titre.toLowerCase().includes(term) || p.lieu.toLowerCase().includes(term);
      const matchType = type === '' || p.type === type;
      return matchTerm && matchType;
    });
  });

  ngOnInit(): void {
    this.pollutionService.getPollutions().subscribe({
      next: (data) => this.rawPollutions.set(data),
      error: (err) => console.error('Erreur de chargement :', err)
    });
  }
  
  onDelete(id: number | string | undefined): void {
    if (!id) return;
    
    if (confirm('Voulez-vous vraiment supprimer cette pollution ?')) {
      this.pollutionService.deletePollution(id).subscribe({
        next: () => {
          // window.location.reload();
          this.rawPollutions.update(list => list.filter(p => p.id !== id)); 
        },
        error: (err) => console.error('Erreur lors de la suppression :', err)
      });
    }
  }
}