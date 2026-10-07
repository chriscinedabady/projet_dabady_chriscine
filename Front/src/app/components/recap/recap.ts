import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Pollution } from '../../models/pollution.model';

@Component({
  selector: 'app-recap',
  imports: [CommonModule, DatePipe],
  templateUrl: './recap.html',
  styleUrl: './recap.scss'
})
export class Recap {
  // @Input permet au composant parent de lui transmettre l'objet Pollution
  @Input() data: Pollution | null = null;
  @Output() reset = new EventEmitter<void>();

  onReset(): void {
    this.reset.emit();
  }
}