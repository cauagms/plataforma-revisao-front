import { Routes } from '@angular/router';
import { Login } from '../pages/login/login';
import { Cadastro } from '../pages/cadastro/cadastro';
import { authGuard } from '../services/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'cadastro', component: Cadastro },
  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () => import('../pages/login/login').then((m) => m.Login), // placeholder
  },
  { path: '**', redirectTo: 'login' },
];
