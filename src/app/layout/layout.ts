import { Component, computed, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

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
  usuario = this.authService.usuario;

  iniciais = computed(() => {
    const nome = this.usuario()?.nome;
    if (!nome) return '';
    return nome
      .split(' ')
      .slice(0, 2)
      .map((p) => p[0].toUpperCase())
      .join('');
  });

  ngOnInit() {
    if (!this.usuario()) {
      this.authService.me().subscribe((user) => {
        this.authService.usuario.set(user);
      });
    }
  }

  toggleSidebar() {
    this.sidebarAberta = !this.sidebarAberta;
  }

  fecharSidebar() {
    this.sidebarAberta = false;
  }

  fecharSidebarAposNavegacao() {
    if (window.innerWidth <= 1024) {
      this.fecharSidebar();
    }
  }

  sair() {
    this.authService.logout();
  }
}
