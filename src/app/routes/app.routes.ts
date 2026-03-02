import { Routes } from '@angular/router';
import { Login } from '../pages/login/login';
import { Cadastro } from '../pages/cadastro/cadastro';
import { authGuard } from '../services/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'cadastro', component: Cadastro },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('../layout/layout').then((m) => m.Layout),
    children: [
      {
        path: 'disciplinas',
        loadComponent: () =>
          import('../pages/disciplinas/disciplinas').then((m) => m.Disciplinas),
      },
      {
        path: 'home',
        redirectTo: 'disciplinas',
        pathMatch: 'full',
      },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
