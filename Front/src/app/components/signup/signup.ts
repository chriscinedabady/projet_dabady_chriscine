import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { SignUpPayload } from '../../models/user';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.scss'
})
export class SignupComponent {
  private authService = inject(AuthService);

  formData: SignUpPayload = {
    username: '',
    email: '',
    password: ''
  };

  isLoading = false;
  successMessage = '';
  errorMessage = '';

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      return;
    }

    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.authService.signUp(this.formData).subscribe({
      next: (createdUser) => {
        this.isLoading = false;
        this.successMessage = `Inscription réussie ! Bienvenue ${createdUser.username}.`;
        form.resetForm();
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = "Une erreur est survenue lors de l'inscription.";
        console.error('Erreur API :', error);
      }
    });
  }
}