import { Component, signal, computed, OnInit, inject } from '@angular/core';
import {
  DashboardService,
  AlunoDesempenhoResponse,
  AlunoPendenteResponse,
  ResumoResponse,
  PendenciasAlunoResponse,
  AtividadeFeedResponse,
  TopicoDificuldadeResponse,
  AlunoAtivoResponse,
} from '../../services/dashboard.service';

type AbaAtiva = 'visao-geral' | 'atividade-recente' | 'revisoes-pendentes';
type FiltroPeriodo = '7dias' | '30dias' | 'mes';
type FiltroAtraso = 'todos' | '7dias' | '15dias' | '30dias';

@Component({
  selector: 'app-dashboard-professor',
  standalone: true,
  templateUrl: './dashboard-professor.html',
  styleUrls: ['./dashboard-professor.scss'],
})
export class DashboardProfessor implements OnInit {
  private dashboardService = inject(DashboardService);

  abaAtiva = signal<AbaAtiva>('visao-geral');
  filtroPeriodo = signal<FiltroPeriodo>('30dias');
  filtroDropdownAberto = signal(false);
  filtroAtraso = signal<FiltroAtraso>('todos');
  modalAberto = signal(false);
  alunoSelecionado = signal<AlunoPendenteResponse | null>(null);
  modalPendenciasAberto = signal(false);
  pendenciasSelecionada = signal<PendenciasAlunoResponse | null>(null);

  resumo = signal<ResumoResponse>({
    alunosAtivos: 0,
    revisoesRealizadas: 0,
    mediaRevisoesPorAluno: 0,
    revisoesPendentes: 0,
  });

  alunosDesempenho = signal<AlunoDesempenhoResponse[]>([]);

  atividades = signal<AtividadeFeedResponse[]>([]);
  topicosDificuldade = signal<TopicoDificuldadeResponse[]>([]);
  alunosMaisAtivos = signal<AlunoAtivoResponse[]>([]);

  alunosPendentes = signal<AlunoPendenteResponse[]>([]);

  alunosPendentesFiltrados = computed(() => {
    const filtro = this.filtroAtraso();
    const lista = this.alunosPendentes();
    if (filtro === 'todos') return lista;
    return lista.filter((a) => {
      if (filtro === '7dias') return a.diasSemRevisar >= 7;
      if (filtro === '15dias') return a.diasSemRevisar >= 15;
      if (filtro === '30dias') return a.diasSemRevisar >= 30;
      return true;
    });
  });

  labelPeriodo = computed(() => {
    const p = this.filtroPeriodo();
    if (p === '7dias') return 'Últimos 7 dias';
    if (p === '30dias') return 'Últimos 30 dias';
    return 'Este mês';
  });

  ngOnInit() {
    this.carregarVisaoGeral();
    this.carregarAtividadeRecente();
    this.carregarRevisoesPendentes();
  }

  carregarVisaoGeral() {
    const periodo = this.filtroPeriodo();
    this.dashboardService.visaoGeral(periodo).subscribe({
      next: (data) => {
        this.resumo.set(data.resumo);
        this.alunosDesempenho.set(data.alunos);
      },
      error: (err) => {
        console.error('Erro ao carregar visão geral:', err);
      },
    });
  }

  carregarAtividadeRecente() {
    const periodo = this.filtroPeriodo();
    this.dashboardService.atividadeRecente(periodo).subscribe({
      next: (data) => {
        this.atividades.set(data.feed);
        this.topicosDificuldade.set(data.topicosDificuldade);
        this.alunosMaisAtivos.set(data.alunosMaisAtivos);
      },
      error: (err) => {
        console.error('Erro ao carregar atividade recente:', err);
      },
    });
  }

  carregarRevisoesPendentes() {
    this.dashboardService.revisoesPendentes().subscribe({
      next: (data) => {
        this.alunosPendentes.set(data);
      },
      error: (err) => {
        console.error('Erro ao carregar revisões pendentes:', err);
      },
    });
  }

  mudarAba(aba: AbaAtiva) {
    this.abaAtiva.set(aba);
    this.filtroDropdownAberto.set(false);

    if (aba === 'visao-geral') {
      this.carregarVisaoGeral();
    } else if (aba === 'atividade-recente') {
      this.carregarAtividadeRecente();
    } else if (aba === 'revisoes-pendentes') {
      this.carregarRevisoesPendentes();
    }
  }

  toggleDropdownPeriodo() {
    this.filtroDropdownAberto.update((v) => !v);
  }

  selecionarPeriodo(periodo: FiltroPeriodo) {
    this.filtroPeriodo.set(periodo);
    this.filtroDropdownAberto.set(false);
    this.carregarVisaoGeral();
    this.carregarAtividadeRecente();
  }

  mudarFiltroAtraso(filtro: FiltroAtraso) {
    this.filtroAtraso.set(filtro);
  }

  abrirModalPendencias(aluno: AlunoDesempenhoResponse) {
    this.dashboardService.pendenciasAluno(aluno.id).subscribe({
      next: (pendencias) => {
        this.pendenciasSelecionada.set(pendencias);
        this.modalPendenciasAberto.set(true);
      },
      error: (err) => {
        console.error('Erro ao carregar pendências:', err);
      },
    });
  }

  formatarTextoAtraso(texto: string): string {
    return texto
      .replace(/há 0 dias/gi, 'pendente para hoje')
      .replace(/atrasado há 0 dias/gi, 'pendente para hoje');
  }

  fecharModalPendencias() {
    this.modalPendenciasAberto.set(false);
    this.pendenciasSelecionada.set(null);
  }

  fecharModalPendenciasPeloOverlay(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.fecharModalPendencias();
    }
  }

  abrirModal(_aluno: AlunoPendenteResponse) {
    // Modal desativado temporariamente
  }

  fecharModal() {
    this.modalAberto.set(false);
    this.alunoSelecionado.set(null);
  }

  fecharModalPeloOverlay(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.fecharModal();
    }
  }
}
