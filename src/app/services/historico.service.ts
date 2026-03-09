import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../env/environment';

export interface ResumoHistorico {
  total_revisoes: number;
  revisoes_semana: number;
  disciplinas_revisadas: number;
  ultima_revisao: string | null;
}

export interface RevisaoHistorico {
  id: number;
  topico_id: number;
  topico: string;
  disciplina_id: number;
  disciplina: string;
  cor_disciplina: string;
  reflexao: string | null;
  criado_em: string;
}

export interface HistoricoResponse {
  resumo: ResumoHistorico;
  revisoes: RevisaoHistorico[];
}

@Injectable({ providedIn: 'root' })
export class HistoricoService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  carregar(filtros?: {
    disciplina_id?: number;
    periodo?: string;
    data_inicio?: string;
    data_fim?: string;
  }): Observable<HistoricoResponse> {
    let params = new HttpParams();
    if (filtros?.disciplina_id) {
      params = params.set('disciplina_id', filtros.disciplina_id);
    }
    if (filtros?.periodo) {
      params = params.set('periodo', filtros.periodo);
    }
    if (filtros?.data_inicio) {
      params = params.set('data_inicio', filtros.data_inicio);
    }
    if (filtros?.data_fim) {
      params = params.set('data_fim', filtros.data_fim);
    }
    return this.http.get<HistoricoResponse>(`${this.apiUrl}/historico`, { params });
  }
}
