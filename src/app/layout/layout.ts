import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './layout.html',
  styleUrls: ['./layout.scss'],
})
export class Layout {
  private authService = inject(AuthService);

  sidebarAberta = false;

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
