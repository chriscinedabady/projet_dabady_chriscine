import { Component } from '@angular/core';
import { PollutionForm } from './components/pollution-form/pollution-form';
import { Recap } from './components/recap/recap';
import { Pollution } from './models/pollution.model';

@Component({
  selector: 'app-root',
  imports: [PollutionForm, Recap],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  // Tant que cette variable est nulle, on affiche le formulaire.
  // Dès qu'elle contient des données, on affiche le récapitulatif.
  pollutionDeclaree: Pollution | null = null;

  onPollutionValidee(nouvellePollution: Pollution): void {
    this.pollutionDeclaree = nouvellePollution;
  }
}