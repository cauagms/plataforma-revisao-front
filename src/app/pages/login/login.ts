import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

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

  form;

  constructor(private fb: FormBuilder, private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      remember: [false],
    });
  }

  get f() {
    return this.form.controls;
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onForgotPassword(event: Event) {
    event.preventDefault();
    console.log('Esqueceu a senha');
  }

  onCreateAccount(event: Event) {
    event.preventDefault();
    this.router.navigate(['/cadastro']);
  }

  async onSubmit() {
    this.submitted = true;
    if (this.form.invalid) return;

    this.loading = true;

    try {
      const { email, password, remember } = this.form.value;
      console.log('Login payload:', { email, password, remember });

      await new Promise((r) => setTimeout(r, 800));
    } finally {
      this.loading = false;
    }
  }
}