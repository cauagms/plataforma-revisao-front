import { Routes } from '@angular/router';
import { Login } from '../pages/login/login';
import { Cadastro } from '../pages/cadastro/cadastro';
import { authGuard, professorGuard, alunoGuard } from '../services/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'cadastro', component: Cadastro },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('../layout/layout').then((m) => m.Layout),
    children: [
      // --- Rotas de professor ---
      {
        path: 'dashboard-professor',
        canActivate: [professorGuard],
        loadComponent: () =>
          import('../pages/dashboard-professor/dashboard-professor').then(
            (m) => m.DashboardProfessor
          ),
      },
      // --- Rotas de aluno ---
      {
        path: 'estudar-hoje',
        canActivate: [alunoGuard],
        loadComponent: () =>
          import('../pages/estudar-hoje/estudar-hoje').then((m) => m.EstudarHoje),
      },
      {
        path: 'disciplinas',
        canActivate: [alunoGuard],
        loadComponent: () =>
          import('../pages/disciplinas/disciplinas').then((m) => m.Disciplinas),
      },
      {
        path: 'disciplinas/:id',
        canActivate: [alunoGuard],
        loadComponent: () =>
          import('../pages/topicos/topicos').then((m) => m.TopicosPage),
      },
      {
        path: 'historico',
        canActivate: [alunoGuard],
        loadComponent: () =>
          import('../pages/historico/historico').then((m) => m.Historico),
      },
      // --- Rotas compartilhadas ---
      {
        path: 'configuracoes',
        loadComponent: () =>
          import('../pages/configuracoes/configuracoes').then((m) => m.Configuracoes),
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
