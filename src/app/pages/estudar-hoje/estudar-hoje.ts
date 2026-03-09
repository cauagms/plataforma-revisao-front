import { ChangeDetectorRef, Component, signal, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { timer, Subscription } from 'rxjs';
import {
  EstudarHojeService,
  TopicoEstudarHoje,
  ResumoEstudarHoje,
} from '../../services/estudar-hoje.service';
import { parseApiUtcDate } from '../../utils/date';

@Component({
  selector: 'app-estudar-hoje',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './estudar-hoje.html',
  styleUrls: ['./estudar-hoje.scss', './estudar-hoje.responsivo.scss'],
})
export class EstudarHoje implements OnInit {
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);
  private estudarHojeService = inject(EstudarHojeService);

  modalPrimeiraRevisaoAberto = false;
  modalRevisaoAberto = false;
  topicoSelecionado: TopicoEstudarHoje | null = null;
  reflexao = new FormControl('');
  toastVisivel = signal(false);
  erroReflexao = false;
  erroApi = '';
  enviando = false;
  private toastSub?: Subscription;
  private reflexaoSub?: Subscription;

  resumo: ResumoEstudarHoje = {
    topicos_para_hoje: 0,
    atrasados: 0,
    revisar_hoje: 0,
    concluidos_hoje: 0,
  };

  atrasados: TopicoEstudarHoje[] = [];
  revisarHoje: TopicoEstudarHoje[] = [];

  ngOnInit() {
    this.carregarDados();
  }

  private carregarDados() {
    this.estudarHojeService
      .carregar()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.resumo = res.resumo;
          this.atrasados = res.topicos.filter((t) => t.status === 'atrasado');
          this.revisarHoje = res.topicos.filter(
            (t) => t.status === 'revisar_hoje' || t.status === 'primeira_revisao',
          );
          this.cdr.detectChanges();
        },
      });
  }

  abrirRevisar(topico: TopicoEstudarHoje) {
    this.topicoSelecionado = topico;
    this.reflexao.reset();
    this.erroReflexao = false;
    this.erroApi = '';
    this.reflexaoSub?.unsubscribe();
    this.reflexaoSub = this.reflexao.valueChanges.subscribe(() => {
      if (this.erroReflexao) this.erroReflexao = false;
    });

    if (topico.status === 'primeira_revisao') {
      this.modalPrimeiraRevisaoAberto = true;
    } else {
      this.modalRevisaoAberto = true;
    }
  }

  fecharModalRevisao() {
    this.modalPrimeiraRevisaoAberto = false;
    this.modalRevisaoAberto = false;
    this.topicoSelecionado = null;
    this.erroApi = '';
    this.reflexaoSub?.unsubscribe();
  }

  fecharModalRevisaoPeloOverlay(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.fecharModalRevisao();
    }
  }

  concluirRevisao() {
    const textoReflexao = (this.reflexao.value ?? '').trim();

    if (!textoReflexao) {
      this.erroReflexao = true;
      return;
    }

    const topico = this.topicoSelecionado;
    if (!topico) return;

    this.erroReflexao = false;
    this.erroApi = '';
    this.enviando = true;

    this.estudarHojeService
      .registrarRevisao(topico.disciplina_id, topico.topico_id, {
        reflexao: textoReflexao,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.enviando = false;
          this.fecharModalRevisao();
          this.mostrarToast();
          this.carregarDados();
        },
        error: () => {
          this.enviando = false;
          this.erroApi = 'Erro ao registrar revisão. Tente novamente.';
        },
      });
  }

  formatarUltimaRevisao(dataIso: string | null): string {
    if (!dataIso) return 'Nunca revisado';
    const data = parseApiUtcDate(dataIso);
    if (!data) return 'Nunca revisado';
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const dataLocal = new Date(data.getFullYear(), data.getMonth(), data.getDate());
    const diffDias = Math.round((hoje.getTime() - dataLocal.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDias === 0) {
      return `Hoje, ${data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    }
    if (diffDias === 1) {
      return `Ontem, ${data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    }
    if (diffDias <= 7) {
      return `Há ${diffDias} dias`;
    }
    return data.toLocaleDateString('pt-BR');
  }

  private mostrarToast() {
    this.toastSub?.unsubscribe();
    this.toastVisivel.set(true);
    this.toastSub = timer(2000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.toastVisivel.set(false));
  }
}
