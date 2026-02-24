import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      terms: [false, Validators.requiredTrue]
    });
  }

  get f() {
    return this.form.controls as {
      nome: any;
      email: any;
      password: any;
      confirmPassword: any;
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
    if (this.form.invalid) return;

    this.loading = true;
    // lógica de cadastro aqui
  }
}