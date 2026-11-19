import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { SignUpPayload, User } from '../../models/user';

@Component({
  selector: 'app-signup',
  imports: [FormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignupComponent implements OnInit {
  private authService = inject(AuthService);

  users = signal<User[]>([]);
  isLoading = signal(false);
  successMessage = signal('');
  errorMessage = signal('');

  formData: SignUpPayload = {
    username: '',
    email: '',
    password: ''
  };

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

    this.isLoading.set(true);
    this.successMessage.set('');
    this.errorMessage.set('');

    this.authService.signUp(this.formData).subscribe({
      next: (createdUser) => {
        this.isLoading.set(false);
        this.successMessage.set(`Inscription réussie ! Bienvenue ${createdUser.username}.`);
        form.resetForm();
        this.loadUsers();
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(
          error?.error?.message || "Une erreur est survenue lors de l'inscription."
        );
        console.error('Erreur API :', error);
      }
    });
  }

  onDeleteUser(id: number | undefined): void {
    if (id === undefined) return;
    if (confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) {
      this.authService.deleteUser(id).subscribe({
        next: () => {
          this.users.update((list) => list.filter((u) => u.id !== id));
        },
        error: (err) => {
          console.error('Erreur lors de la suppression :', err);
          this.errorMessage.set("Impossible de supprimer cet utilisateur.");
        }
      });
    }
  }
}
