import { Component, computed, ElementRef, inject, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-configuracoes',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './configuracoes.html',
  styleUrls: ['./configuracoes.scss', './configuracoes.responsivo.scss'],
})
export class Configuracoes {
  private authService = inject(AuthService);

  usuario = this.authService.usuario;
  editando = signal(false);
  salvando = signal(false);
  nomeEditado = '';
  erroMensagem = signal<string | null>(null);

  inputNome = viewChild<ElementRef<HTMLInputElement>>('inputNome');

  iniciais = computed(() => {
    const nome = this.usuario()?.nome;
    if (!nome) return '';
    return nome
      .split(' ')
      .slice(0, 2)
      .map((p) => p[0].toUpperCase())
      .join('');
  });

  roleFmt = computed(() => {
    const role = this.usuario()?.role;
    if (!role) return '';
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  });

  entrarEdicao() {
    this.nomeEditado = this.usuario()?.nome ?? '';
    this.erroMensagem.set(null);
    this.editando.set(true);
    setTimeout(() => this.inputNome()?.nativeElement.focus());
  }

  cancelarEdicao() {
    this.editando.set(false);
    this.erroMensagem.set(null);
  }

  salvar() {
    const nome = this.nomeEditado.trim();

    if (!nome || nome.length < 2) {
      this.erroMensagem.set('O nome deve ter pelo menos 2 caracteres.');
      return;
    }

    if (nome === this.usuario()?.nome) {
      this.editando.set(false);
      return;
    }

    this.salvando.set(true);
    this.erroMensagem.set(null);

    this.authService.atualizarNome(nome).subscribe({
      next: () => {
        this.salvando.set(false);
        this.editando.set(false);
      },
      error: (err) => {
        this.salvando.set(false);
        this.erroMensagem.set(this.extrairErro(err));
      },
    });
  }

  private extrairErro(err: any): string {
    const body = err.error;
    if (!body) return 'Erro ao salvar. Tente novamente.';

    if (typeof body.detail === 'string') return body.detail;

    if (Array.isArray(body.detail) && body.detail.length > 0) {
      return body.detail.map((e: any) => e.msg ?? e.message ?? String(e)).join('; ');
    }

    if (typeof body.message === 'string') return body.message;

    return 'Erro ao salvar. Tente novamente.';
  }
}
