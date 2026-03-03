import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User } from '../models/auth.model';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './layout.html',
  styleUrls: ['./layout.scss'],
})
export class Layout implements OnInit {
  private authService = inject(AuthService);

  sidebarAberta = false;
  usuario: User | null = null;

  ngOnInit() {
    this.authService.me().subscribe((usuario) => {
      this.usuario = usuario;
    });
  }

  get iniciais(): string {
    if (!this.usuario?.nome) return '';
    return this.usuario.nome
      .split(' ')
      .slice(0, 2)
      .map((p) => p[0].toUpperCase())
      .join('');
  }

  toggleSidebar() {
    this.sidebarAberta = !this.sidebarAberta;
  }

  fecharSidebar() {
    this.sidebarAberta = false;
  }

  sair() {
    this.authService.logout();
  }
}
