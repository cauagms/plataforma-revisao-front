import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  HistoricoService,
  ResumoHistorico,
  RevisaoHistorico,
} from '../../services/historico.service';
import { DisciplinaService } from '../../services/disciplina.service';
import { Disciplina } from '../../models/disciplina.model';
import { parseApiUtcDate } from '../../utils/date';

type Periodo = 'hoje' | '7dias' | '30dias';

@Component({
  selector: 'app-historico',
  standalone: true,
  templateUrl: './historico.html',
  styleUrls: ['./historico.scss', './historico.responsivo.scss'],
})
export class Historico implements OnInit {
  private destroyRef = inject(DestroyRef);
  private historicoService = inject(HistoricoService);
  private disciplinaService = inject(DisciplinaService);

  resumo = signal<ResumoHistorico>({
    total_revisoes: 0,
    revisoes_semana: 0,
    disciplinas_revisadas: 0,
    ultima_revisao: null,
  });

  revisoes = signal<RevisaoHistorico[]>([]);
  disciplinas = signal<Disciplina[]>([]);

  filtroDisciplinaId: number | null = null;
  filtroPeriodo: Periodo = 'hoje';

  ngOnInit() {
    this.carregarDisciplinas();
    this.carregarDados();
  }

  private carregarDisciplinas() {
    this.disciplinaService
      .listar()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (disciplinas) => {
          this.disciplinas.set(disciplinas);
        },
      });
  }

  carregarDados() {
    const filtros: {
      disciplina_id?: number;
      periodo?: string;
    } = {};

    if (this.filtroDisciplinaId) {
      filtros.disciplina_id = this.filtroDisciplinaId;
    }
    if (this.filtroPeriodo) {
      filtros.periodo = this.filtroPeriodo;
    }

    this.historicoService
      .carregar(filtros)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.resumo.set(res.resumo);
          this.revisoes.set(res.revisoes);
        },
      });
  }

  selecionarPeriodo(periodo: Periodo) {
    this.filtroPeriodo = periodo;
    this.carregarDados();
  }

  onDisciplinaChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.filtroDisciplinaId = value ? Number(value) : null;
    this.carregarDados();
  }

  formatarDataRevisao(dataIso: string): string {
    const data = parseApiUtcDate(dataIso);
    if (!data) return '';
    return data.toLocaleDateString('pt-BR');
  }

  formatarHoraRevisao(dataIso: string): string {
    const data = parseApiUtcDate(dataIso);
    if (!data) return '';
    return data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  formatarUltimaRevisao(dataIso: string | null): string {
    if (!dataIso) return '—';
    const data = parseApiUtcDate(dataIso);
    if (!data) return '—';
    return data.toLocaleDateString('pt-BR');
  }
}
