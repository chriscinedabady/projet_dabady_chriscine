import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { SignUpPayload, User } from '../../models/user';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.scss'
})
export class SignupComponent implements OnInit {
  private authService = inject(AuthService);

  users = signal<User[]>([]);

  formData: SignUpPayload = {
    username: '',
    email: '',
    password: ''
  };

  isLoading = false;
  successMessage = '';
  errorMessage = '';

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.authService.getUsers().subscribe({
      next: (data) => this.users.set(data),
      error: (err) => console.error('Erreur lors du chargement des utilisateurs :', err)
    });
  }

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
        this.loadUsers();
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = "Une erreur est survenue lors de l'inscription.";
        console.error('Erreur API :', error);
      }
    });
  }

  onDeleteUser(id: number | string | undefined): void {
    if (!id) return;
    if (confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) {
      this.authService.deleteUser(id).subscribe({
        next: () => {
          this.users.update((list) => list.filter((u) => u.id !== id));
        },
        error: (err) => console.error('Erreur lors de la suppression :', err)
      });
    }
  }
}
