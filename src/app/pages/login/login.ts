import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login {
  submitted = false;
  loading = false;
  showPassword = false;
  errorMessage: string | null = null;

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required]],
      remember: [false],
    });
  }

  get f() {
    return this.form.controls as {
      email: any;
      senha: any;
      remember: any;
    };
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onForgotPassword(event: Event) {
    event.preventDefault();
    console.log('Esqueceu a senha');
  }

  onSubmit() {
    this.submitted = true;
    this.errorMessage = null;
    if (this.form.invalid) return;

    this.loading = true;
    const { email, senha } = this.form.value;

    this.authService.login({ email, senha }).subscribe({
      next: () => {
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Erro ao fazer login. Tente novamente.';
      },
    });
  }
}
