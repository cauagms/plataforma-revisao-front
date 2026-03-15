import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../env/environment';

export interface AlunoDesempenhoResponse {
  id: number;
  nome: string;
  email: string;
  iniciais: string;
  cor: string;
  revisoes: number;
  ultimaRevisao: string;
  progresso: number;
}

export interface ResumoResponse {
  alunosAtivos: number;
  revisoesRealizadas: number;
  mediaRevisoesPorAluno: number;
  revisoesPendentes: number;
}

export interface VisaoGeralResponse {
  resumo: ResumoResponse;
  alunos: AlunoDesempenhoResponse[];
}

export interface TopicoPendenteResponse {
  disciplina: string;
  topico: string;
  dias: number;
  urgencia: string;
}

export interface PendenciasAlunoResponse {
  nome: string;
  iniciais: string;
  cor: string;
  topicosPendentes: TopicoPendenteResponse[];
  ultimaRevisaoFeita: string;
  totalRevisoesPendentes: number;
  disciplinaMaisAcumulada: string;
  proximaRevisaoRecomendada: string;
}

export interface AtividadeFeedResponse {
  nome: string;
  iniciais: string;
  cor: string;
  topico: string;
  disciplina: string;
  corDisciplina: string;
  data: string;
  reflexao: string;
  emSequencia: number;
}

export interface TopicoDificuldadeResponse {
  nome: string;
  disciplina: string;
  percentual: number;
}

export interface AlunoAtivoResponse {
  nome: string;
  iniciais: string;
  cor: string;
  revisoes: number;
  posicao: number;
  emSequencia: number;
}

export interface AlunoPendenteResponse {
  id: number;
  nome: string;
  email: string;
  iniciais: string;
  cor: string;
  ultimaRevisao: string;
  diasSemRevisar: number;
  situacao: 'Urgente' | 'Atrasado';
  progressoGeral: number;
  disciplinas: { nome: string; percentual: number }[];
  ultimasRevisoes: { topico: string; reflexao: string; data: string }[];
}

export interface AtividadeRecenteResponse {
  feed: AtividadeFeedResponse[];
  topicosDificuldade: TopicoDificuldadeResponse[];
  alunosMaisAtivos: AlunoAtivoResponse[];
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  visaoGeral(periodo: string = '30dias'): Observable<VisaoGeralResponse> {
    return this.http.get<VisaoGeralResponse>(`${this.apiUrl}/dashboard/visao-geral`, {
      params: { periodo },
    });
  }

  pendenciasAluno(alunoId: number): Observable<PendenciasAlunoResponse> {
    return this.http.get<PendenciasAlunoResponse>(`${this.apiUrl}/dashboard/aluno/${alunoId}/pendencias`);
  }

  atividadeRecente(periodo: string = '30dias'): Observable<AtividadeRecenteResponse> {
    return this.http.get<AtividadeRecenteResponse>(`${this.apiUrl}/dashboard/atividade-recente`, {
      params: { periodo },
    });
  }

  revisoesPendentes(): Observable<AlunoPendenteResponse[]> {
    return this.http.get<AlunoPendenteResponse[]>(`${this.apiUrl}/dashboard/revisoes-pendentes`);
  }
}
