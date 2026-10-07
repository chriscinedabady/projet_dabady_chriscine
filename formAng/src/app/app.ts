import { Component, signal } from '@angular/core';
import { SignUpComponent } from './components/sign-up/sign-up'; // <-- 1. Import de la classe


@Component({
  imports: [
    SignUpComponent],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('formAng');
}