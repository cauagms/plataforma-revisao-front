import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cadastro',
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.scss',
})
export class Cadastro {
  form: FormGroup;
  submitted = false;
  loading = false;
  showPassword = false;
  showConfirmPassword = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.form = this.fb.group(
      {
        nome: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        senha: ['', [Validators.required, Validators.minLength(8), this.uppercaseValidator]],
        confirmSenha: ['', Validators.required],
        terms: [false, Validators.requiredTrue],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  get f() {
    return this.form.controls as {
      nome: any;
      email: any;
      senha: any;
      confirmSenha: any;
      terms: any;
    };
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit() {
    this.submitted = true;
    this.errorMessage = null;
    if (this.form.invalid) return;

    this.loading = true;
    const { nome, email, senha } = this.form.value;

    this.authService.register({ nome, email, senha }).subscribe({
      next: () => {
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || err.error?.detail || 'Erro ao criar conta. Tente novamente.';
      },
    });
  }

  private uppercaseValidator(control: AbstractControl): ValidationErrors | null {
    const value: string = control.value || '';
    return /[A-Z]/.test(value) ? null : { noUppercase: true };
  }

  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const senha = control.get('senha')?.value;
    const confirmSenha = control.get('confirmSenha')?.value;
    return senha === confirmSenha ? null : { passwordMismatch: true };
  }
}
