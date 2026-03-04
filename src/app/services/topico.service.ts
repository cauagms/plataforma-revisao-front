import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../env/environment';
import { Topico } from '../models/topico.model';

export interface CriarTopicoRequest {
  titulo: string;
}

export interface EditarTopicoRequest {
  titulo: string;
}

@Injectable({ providedIn: 'root' })
export class TopicoService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  listarPorDisciplina(disciplinaId: number): Observable<Topico[]> {
    return this.http.get<Topico[]>(`${this.apiUrl}/disciplinas/${disciplinaId}/topicos`);
  }

  criar(disciplinaId: number, dados: CriarTopicoRequest): Observable<Topico> {
    return this.http.post<Topico>(`${this.apiUrl}/disciplinas/${disciplinaId}/topicos`, dados);
  }

  editar(disciplinaId: number, topicoId: number, dados: EditarTopicoRequest): Observable<Topico> {
    return this.http.put<Topico>(
      `${this.apiUrl}/disciplinas/${disciplinaId}/topicos/${topicoId}`,
      dados,
    );
  }

  excluir(disciplinaId: number, topicoId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/disciplinas/${disciplinaId}/topicos/${topicoId}`,
    );
  }
}
