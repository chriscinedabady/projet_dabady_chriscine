import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.scss'
})
export class SignUpComponent {
  formData = {
    login: '',
    password: '',
    confirmPassword: '',
    nom: '',
    prenom: '',
    email: ''
  };

  // Visibilité des mots de passe
  showPassword = false;
  showConfirmPassword = false;

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit(): void {
    if (this.formData.password !== this.formData.confirmPassword) {
      alert('Erreur dans la Force : Les mots de passe ne correspondent pas !');
      return;
    }
    console.log('Nouvelle recrue enregistrée :', this.formData);
  }
}