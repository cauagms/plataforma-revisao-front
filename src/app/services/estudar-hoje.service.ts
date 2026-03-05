import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../env/environment';

export interface ResumoEstudarHoje {
  topicos_para_hoje: number;
  atrasados: number;
  revisar_hoje: number;
  concluidos_hoje: number;
}

export interface TopicoEstudarHoje {
  disciplina_id: number;
  topico_id: number;
  topico: string;
  disciplina: string;
  cor_disciplina: string;
  status: 'atrasado' | 'revisar_hoje' | 'primeira_revisao';
  ultima_revisao_em: string | null;
  proxima_revisao_em: string | null;
  total_revisoes: number;
}

export interface EstudarHojeResponse {
  resumo: ResumoEstudarHoje;
  topicos: TopicoEstudarHoje[];
}

export interface RegistrarRevisaoRequest {
  reflexao: string | null;
}

export interface RegistrarRevisaoResponse {
  id: number;
  topico_id: number;
  reflexao: string | null;
  criado_em: string;
}

@Injectable({ providedIn: 'root' })
export class EstudarHojeService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  carregar(): Observable<EstudarHojeResponse> {
    return this.http.get<EstudarHojeResponse>(`${this.apiUrl}/estudar-hoje`);
  }

  registrarRevisao(
    disciplinaId: number,
    topicoId: number,
    dados: RegistrarRevisaoRequest,
  ): Observable<RegistrarRevisaoResponse> {
    return this.http.post<RegistrarRevisaoResponse>(
      `${this.apiUrl}/disciplinas/${disciplinaId}/topicos/${topicoId}/revisoes`,
      dados,
    );
  }
}
